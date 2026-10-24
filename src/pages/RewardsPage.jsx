import React, { useState } from 'react';
import {
  Gift,
  Lock,
  ShoppingBag,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import {
  StickerCard,
  StickerButton,
  Pill,
  ProgressBar
} from '../components/ui';
import Modal from '../components/Modal';

export const RewardsPage = () => {
  const { user, rewards, redeemReward } = useWellness();
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);

  const handleOpenRedeemModal = (reward) => {
    setSelectedReward(reward);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    setRedeeming(true);
    try {
      await redeemReward(selectedReward.id);
    } finally {
      setRedeeming(false);
      setSelectedReward(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Context & Balance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Pill tone="butter" className="border-2 border-ink text-[10px]">
              Incentive Marketplace
            </Pill>
            <span className="font-display text-xs font-bold text-ink">Company Funded Vitality</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-ink">
            Rewards Store
          </h2>
          <p className="text-xs sm:text-sm text-muted font-medium mt-0.5">
            Convert your logged healthy steps and mindfulness minutes into tangible perks and vouchers.
          </p>
        </div>

        {/* Live Points Balance Card */}
        <div className="p-3 px-5 border-[3px] border-ink bg-butter shadow-sticker-sm flex items-center gap-3.5 self-start sm:self-auto">
          <div className="w-10 h-10 border-2 border-ink bg-white flex items-center justify-center text-ink shadow-[2px_2px_0_#111]">
            <Gift className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <span className="font-display text-[10px] uppercase font-bold text-ink block">
              Available Balance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-display font-bold tabular-nums text-ink">
                {user?.totalPoints || 950}
              </span>
              <span className="text-xs font-bold font-display text-ink">
                Points Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewards.map((reward) => {
          const hasEnough = (user?.totalPoints || 0) >= reward.pointsCost;
          const deficit = Math.max(0, reward.pointsCost - (user?.totalPoints || 0));
          const percentProgress = Math.min(100, Math.round(((user?.totalPoints || 0) / reward.pointsCost) * 100));

          return (
            <StickerCard
              key={reward.id}
              tone="white"
              shadow="sticker"
              className={`p-4 flex flex-col justify-between space-y-4 ${
                !hasEnough ? 'opacity-90' : ''
              }`}
            >
              {/* Product Photo */}
              <div className="relative w-full h-40 border-[3px] border-ink bg-paper overflow-hidden">
                <img
                  src={reward.image}
                  alt={reward.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Pill tone={hasEnough ? "sage" : "butter"} className="border-2 border-ink text-[10px]">
                    {reward.pointsCost} pts
                  </Pill>
                </div>
                {!hasEnough && (
                  <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
                    <span className="px-3 py-1 border-2 border-ink bg-white text-xs font-display font-bold text-ink flex items-center gap-1 shadow-sticker-sm">
                      <Lock className="w-3.5 h-3.5 text-ink" />
                      Locked
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Specs */}
              <div className="space-y-1.5 flex-1">
                <span className="font-display text-[10px] uppercase font-bold text-muted block">
                  {reward.category} • {reward.partner}
                </span>

                <h3 className="text-base font-display font-bold text-ink line-clamp-1 leading-snug">
                  {reward.title}
                </h3>

                <p className="text-xs text-ink/80 leading-relaxed line-clamp-2">
                  {reward.description}
                </p>
              </div>

              {/* Status / CTA */}
              <div className="pt-3 border-t-[2px] border-dashed border-ink/30 space-y-3">
                {!hasEnough ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-display font-bold">
                      <span className="text-ink flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose" />
                        {deficit} more pts
                      </span>
                      <span className="text-muted">{percentProgress}%</span>
                    </div>
                    <div className="h-2.5 border-2 border-ink bg-white overflow-hidden">
                      <div
                        className="bg-butter h-full border-r-2 border-ink"
                        style={{ width: `${percentProgress}%` }}
                      />
                    </div>
                    <button
                      disabled
                      className="w-full py-2 px-3 border-2 border-ink bg-paper text-muted text-xs font-display font-bold cursor-not-allowed text-center"
                    >
                      Insufficient Points
                    </button>
                  </div>
                ) : (
                  <StickerButton
                    variant="primary"
                    onClick={() => handleOpenRedeemModal(reward)}
                    className="w-full text-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Redeem for {reward.pointsCost} pts</span>
                  </StickerButton>
                )}
              </div>
            </StickerCard>
          );
        })}
      </div>

      {/* Redemption Confirmation Modal */}
      <Modal
        isOpen={!!selectedReward}
        onClose={() => setSelectedReward(null)}
        title="Confirm Reward Redemption"
        subtitle="Points Ledger Transaction"
      >
        {selectedReward && (
          <div className="space-y-4 text-left">
            <div className="p-4 border-[3px] border-ink bg-butter flex items-center gap-4 shadow-sticker-sm">
              <img
                src={selectedReward.image}
                alt={selectedReward.title}
                className="w-16 h-16 border-2 border-ink object-cover"
              />
              <div>
                <h4 className="text-sm font-display font-bold text-ink">
                  {selectedReward.title}
                </h4>
                <p className="text-xs text-ink/80">
                  Partner: {selectedReward.partner}
                </p>
                <span className="font-display text-xs font-bold text-ink block mt-1">
                  Cost: {selectedReward.pointsCost} Points
                </span>
              </div>
            </div>

            <div className="p-3 border-[2px] border-ink bg-white text-xs font-display font-bold text-ink space-y-1">
              <div className="flex justify-between">
                <span>Current Points:</span>
                <span className="tabular-nums">{user?.totalPoints || 950} pts</span>
              </div>
              <div className="flex justify-between text-rose">
                <span>Points to Deduct:</span>
                <span className="tabular-nums">-{selectedReward.pointsCost} pts</span>
              </div>
              <div className="flex justify-between pt-1 border-t-2 border-dashed border-ink/30 text-ink">
                <span>Remaining Balance:</span>
                <span className="tabular-nums">{(user?.totalPoints || 950) - selectedReward.pointsCost} pts</span>
              </div>
            </div>

            <p className="text-xs text-muted">
              Upon confirmation, an electronic redemption voucher will be dispatched to <strong>{user?.email}</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <StickerButton
                variant="secondary"
                onClick={() => setSelectedReward(null)}
                className="text-xs"
              >
                Cancel
              </StickerButton>

              <StickerButton
                variant="primary"
                onClick={handleConfirmRedeem}
                disabled={redeeming}
                className="text-xs"
              >
                {redeeming ? (
                  <span>Redeeming...</span>
                ) : (
                  <>
                    <span>Confirm & Deduct Points</span>
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

export default RewardsPage;
