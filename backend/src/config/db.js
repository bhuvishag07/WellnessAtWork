import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';

/**
 * Safely masks database credentials from a MongoDB connection string for secret-safe logging.
 */
export const maskMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '';
  return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)[^@]+(@.+)/i, '$1****$2');
};

/**
 * Extracts the primary hostname from a MongoDB connection string.
 */
const extractHostname = (uri) => {
  if (!uri || typeof uri !== 'string') return null;
  const match = uri.match(/^mongodb(?:\+srv)?:\/\/(?:[^:]+:[^@]+@)?([^/?#]+)/i);
  return match ? match[1].split(',')[0].split(':')[0] : null;
};

/**
 * Configures the DNS resolver for SRV lookups when needed.
 * 1. Honors explicit DNS_SERVERS env var if set (e.g. DNS_SERVERS=8.8.8.8,1.1.1.1).
 * 2. On platforms where system DNS already works (e.g. Render, Linux, standard networks),
 *    leaves the system DNS resolver completely untouched.
 * 3. In environments where local system DNS fails on SRV queries (e.g. macOS c-ares EBADRESP
 *    over cellular hotspots or buggy routers), gracefully falls back to public DNS resolvers.
 */
export const configureDnsForSrv = async (uri) => {
  if (!uri || !uri.startsWith('mongodb+srv://')) return;

  if (process.env.DNS_SERVERS) {
    const servers = process.env.DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean);
    if (servers.length > 0) {
      dns.setServers(servers);
      console.log(`[DNS] Using configured DNS servers: ${servers.join(', ')}`);
      return;
    }
  }

  const hostname = extractHostname(uri);
  if (!hostname) return;

  try {
    // Probe SRV resolution with current system resolver
    await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);
  } catch (err) {
    if (['EBADRESP', 'ENODATA', 'ESERVFAIL', 'ECONNREFUSED'].includes(err?.code)) {
      console.warn(`[DNS] System DNS resolver failed SRV query (${err.code}). Applying reliable fallback resolver (8.8.8.8)...`);
      try {
        dns.setServers(['8.8.8.8']);
        await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);
        console.log('[DNS] Fallback DNS resolver verified successfully for Atlas cluster.');
      } catch (fallbackErr) {
        console.warn(`[DNS] Fallback DNS probe failed: ${fallbackErr.message}`);
      }
    }
  }
};

export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/wellnessatwork';

  if (!primaryUri && isProduction) {
    throw new Error('[MongoDB] Fatal: MONGODB_URI environment variable is required in production.');
  }

  // Attempt primary connection (MongoDB Atlas)
  if (primaryUri) {
    await configureDnsForSrv(primaryUri);
    try {
      const connectOptions = {
        serverSelectionTimeoutMS: isProduction ? 15000 : 7000,
        connectTimeoutMS: isProduction ? 15000 : 7000,
        socketTimeoutMS: 45000
      };
      if (process.env.MONGODB_DB_NAME) {
        connectOptions.dbName = process.env.MONGODB_DB_NAME;
      }
      const conn = await mongoose.connect(primaryUri, connectOptions);
      await conn.connection.db.admin().command({ ping: 1 });
      console.log(`[MongoDB] Connected successfully to Atlas cluster: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (primaryErr) {
      console.error(`[MongoDB] Primary database connection failed: ${primaryErr.message}`);

      if (isProduction) {
        // Never fall back to local database in production
        throw new Error(`[MongoDB] Production connection to ${maskMongoUri(primaryUri)} failed: ${primaryErr.message}`);
      }

      console.warn('[MongoDB] [DEVELOPMENT ONLY] Atlas unavailable. Attempting local development fallback...');
      await mongoose.disconnect().catch(() => {});
    }
  }

  // Development-only fallback to local MongoDB
  try {
    console.log(`[MongoDB] Connecting to local fallback: ${maskMongoUri(fallbackUri)}`);
    const conn = await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    await conn.connection.db.admin().command({ ping: 1 });
    console.log(`[MongoDB] Connected to local fallback database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (fallbackErr) {
    console.error(`[MongoDB] Local database connection failed: ${fallbackErr.message}`);
    throw fallbackErr;
  }
};

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Runtime connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to database.');
});
