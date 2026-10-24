import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Calendar,
  Video,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill
} from '../components/ui';
import Modal from '../components/Modal';

export const SessionsPage = () => {
  const { sessions, bookSession, cancelSessionBooking, user } = useWellness();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSessionToBook, setSelectedSessionToBook] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const categories = ['All', '1-on-1 Counseling', 'Yoga / Desk Stretching', 'Guided Meditation', 'Nutrition & Vitality'];

  const filteredSessions = sessions.filter(s => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  const handleOpenBookingModal = (session) => {
    setSelectedSessionToBook(session);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSessionToBook) return;
    setConfirming(true);
    try {
      await bookSession(selectedSessionToBook.id);
    } finally {
      setConfirming(false);
      setSelectedSessionToBook(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Context & User Bookings Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Pill tone="butter" className="border-2 border-ink text-[10px]">
              Confidential Mindful Care
            </Pill>
            <span className="font-display text-xs font-bold text-ink">100% Isolated from HR</span>
          </div>
          <p className="text-xs sm:text-sm text-muted font-medium">
            Book certified psychological counseling, live ergonomic desk yoga, or guided mindfulness pauses.
          </p>
        </div>

        {/* User Bookings Pill */}
        <div className="p-3 px-4 border-[3px] border-ink bg-white shadow-sticker-sm flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-ink stroke-[2]" />
          <div>
            <span className="font-display text-[10px] uppercase font-bold text-ink block">
              Your Scheduled Care
            </span>
            <span className="text-xs font-bold font-display text-ink">
              {user?.upcomingSessionsCount || 2} Upcoming Sessions
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 border-[3px] border-ink font-display text-xs font-bold whitespace-nowrap transition-transform duration-100 ease-out cursor-pointer ${
              selectedCategory === cat
                ? 'bg-ink text-butter shadow-sticker-sm'
                : 'bg-white text-ink shadow-sticker-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-paper'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSessions.map((session) => (
          <StickerCard
            key={session.id}
            tone={session.booked ? 'sage' : 'white'}
            shadow="sticker"
            className="flex flex-col justify-between space-y-5 p-6"
          >
            <div className="space-y-4">
              {/* Category & Badge */}
              <div className="flex items-center justify-between">
                <Pill
                  tone={session.category?.includes('1-on-1') ? 'peri' : 'butter'}
                  className="border-2 border-ink text-[11px]"
                >
                  {session.categoryBadge || session.category}
                </Pill>

                {session.booked ? (
                  <span className="inline-flex items-center gap-1 font-display text-xs font-bold text-ink bg-white px-2.5 py-1 border-[2px] border-ink shadow-[2px_2px_0_#111]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ink stroke-[2.5]" />
                    Booked & Locked
                  </span>
                ) : (
                  <span className="font-display text-xs text-ink/80 font-bold">
                    {session.availableSlots} spots available
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-display font-bold text-ink">
                  {session.title}
                </h3>
                <p className="text-xs text-ink/80 mt-1.5 leading-relaxed">
                  {session.description}
                </p>
              </div>

              {/* Facilitator Card */}
              <div className="p-3 border-[2px] border-ink bg-white flex items-center gap-3 shadow-sticker-sm">
                <img
                  src={session.facilitatorAvatar}
                  alt={session.facilitator}
                  className="w-10 h-10 border-2 border-ink object-cover"
                />
                <div>
                  <h4 className="text-xs font-display font-bold text-ink">
                    {session.facilitator}
                  </h4>
                  <p className="text-[11px] text-muted">
                    {session.facilitatorTitle}
                  </p>
                </div>
              </div>

              {/* Timing & Mode */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 border-[2px] border-ink bg-paper space-y-0.5">
                  <span className="font-display text-[10px] uppercase font-bold text-ink block">Date & Time</span>
                  <span className="font-display font-bold text-ink block truncate">
                    {session.date}
                  </span>
                  <span className="text-[11px] text-muted block">
                    {session.time}
                  </span>
                </div>

                <div className="p-2.5 border-[2px] border-ink bg-paper space-y-0.5">
                  <span className="font-display text-[10px] uppercase font-bold text-ink block">Format</span>
                  <span className="font-display font-bold text-ink block truncate">
                    {session.duration}
                  </span>
                  <span className="text-[11px] text-muted block truncate">
                    {session.mode}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t-[2px] border-dashed border-ink/30 flex items-center justify-between gap-3">
              {session.booked ? (
                <div className="w-full flex items-center justify-between">
                  <div className="text-xs text-ink font-bold font-display flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-ink stroke-[2]" />
                    <span>Video link sent to email</span>
                  </div>
                  <button
                    onClick={() => cancelSessionBooking(session.id)}
                    className="text-xs font-display font-bold text-ink underline hover:text-rose cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                </div>
              ) : (
                <StickerButton
                  variant="primary"
                  onClick={() => handleOpenBookingModal(session)}
                  className="w-full text-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Confidential Session</span>
                </StickerButton>
              )}
            </div>
          </StickerCard>
        ))}
      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={!!selectedSessionToBook}
        onClose={() => setSelectedSessionToBook(null)}
        title="Confirm Session Booking"
        subtitle="Confidential Care & Ergonomics"
      >
        {selectedSessionToBook && (
          <div className="space-y-4 text-left">
            <div className="p-4 border-[3px] border-ink bg-butter space-y-2 shadow-sticker-sm">
              <h4 className="text-sm font-display font-bold text-ink">
                {selectedSessionToBook.title}
              </h4>
              <p className="text-xs text-ink/80">
                Facilitated by <strong>{selectedSessionToBook.facilitator}</strong> ({selectedSessionToBook.facilitatorTitle})
              </p>
              <div className="flex items-center gap-4 font-display text-xs font-bold text-ink pt-1">
                <span>🗓 {selectedSessionToBook.date}</span>
                <span>⏰ {selectedSessionToBook.time}</span>
              </div>
            </div>

            {/* Confidentiality Privacy Note */}
            <div className="flex items-start gap-2.5 p-3 border-[2px] border-ink bg-white text-xs text-ink">
              <ShieldCheck className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
              <p>
                <strong>Confidentiality Notice:</strong> Neither your attendance nor session contents are shared with management, HR, or recorded in team rankings.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <StickerButton
                variant="secondary"
                onClick={() => setSelectedSessionToBook(null)}
                className="text-xs"
              >
                Go Back
              </StickerButton>

              <StickerButton
                variant="primary"
                onClick={handleConfirmBooking}
                disabled={confirming}
                className="text-xs"
              >
                {confirming ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </StickerButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SessionsPage;
