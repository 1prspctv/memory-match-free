'use client';

interface PerfectGameCongratsProps {
  playerName: string;
  finalScore: number;
  wrongAttempts: number;
  timeElapsed: number;
  onContinue: () => void;
}

export default function PerfectGameCongrats({
  playerName,
  finalScore,
  wrongAttempts,
  timeElapsed,
  onContinue
}: PerfectGameCongratsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-3xl p-8 shadow-2xl text-center max-w-md w-full animate-slideUp border-4 border-yellow-400">
        {/* Animated Trophy */}
        <div className="text-8xl mb-4 animate-bounce">
          {wrongAttempts === 0 ? '🏆' : '⭐'}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
          {wrongAttempts === 0 ? 'PERFECT GAME!' : 'EXCELLENT!'}
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-700 mb-6 font-semibold">
          {wrongAttempts === 0
            ? `${playerName}, you're a memory master! 🎯`
            : `${playerName}, incredible performance! 🌟`
          }
        </p>

        {/* Achievement Box */}
        <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="text-5xl font-bold text-yellow-600 mb-3">
            {finalScore.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            {wrongAttempts === 0 && (
              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                <span className="text-2xl">✓</span>
                <span>Zero Mistakes - Flawless Victory!</span>
              </div>
            )}
            {wrongAttempts === 1 && (
              <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                <span className="text-2xl">⚡</span>
                <span>Only 1 Mistake - Amazing Memory!</span>
              </div>
            )}
            <div className="text-gray-500 mt-2">
              Completed in {Math.floor(timeElapsed / 1000)} seconds
            </div>
          </div>
        </div>

        {/* Fun Facts / Encouragement */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 italic">
            {wrongAttempts === 0
              ? '"Perfect memory is the key to mastery!" 🧠'
              : '"Excellence is a habit, not an act!" 💪'
            }
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-8 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
        >
          Continue to Results 🎉
        </button>
      </div>
    </div>
  );
}
