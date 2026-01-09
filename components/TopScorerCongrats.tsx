'use client';

interface TopScorerCongratsProps {
  playerName: string;
  finalScore: number;
  dailyRank: number | null;
  alltimeRank: number | null;
  onContinue: () => void;
}

export default function TopScorerCongrats({
  playerName,
  finalScore,
  dailyRank,
  alltimeRank,
  onContinue
}: TopScorerCongratsProps) {
  const bestRank = Math.min(
    dailyRank || Infinity,
    alltimeRank || Infinity
  );

  const isFirst = bestRank === 1;
  const isTop3 = bestRank <= 3;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl p-8 shadow-2xl text-center max-w-md w-full animate-slideUp border-4 border-purple-400">
        {/* Animated Crown/Medal */}
        <div className="text-8xl mb-4 animate-bounce">
          {isFirst ? '👑' : isTop3 ? '🥇' : '🏅'}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {isFirst ? 'CHAMPION!' : 'TOP SCORER!'}
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-700 mb-6 font-semibold">
          {isFirst
            ? `${playerName}, you're #1! 🎊`
            : `${playerName}, you made the leaderboard! 🌟`
          }
        </p>

        {/* Achievement Box */}
        <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg space-y-4">
          <div className="text-5xl font-bold text-purple-600 mb-3">
            {finalScore.toLocaleString()}
          </div>

          {/* Rankings */}
          <div className="space-y-2">
            {dailyRank && dailyRank <= 10 && (
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                dailyRank === 1
                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400'
                  : dailyRank <= 3
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
                  : 'bg-gray-100'
              }`}>
                <span className="font-semibold text-gray-700">🏆 Today's Rank:</span>
                <span className="text-2xl font-bold text-purple-600">
                  #{dailyRank}
                </span>
              </div>
            )}

            {alltimeRank && alltimeRank <= 10 && (
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                alltimeRank === 1
                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400'
                  : alltimeRank <= 3
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
                  : 'bg-gray-100'
              }`}>
                <span className="font-semibold text-gray-700">👑 All-Time Rank:</span>
                <span className="text-2xl font-bold text-pink-600">
                  #{alltimeRank}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Message */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 font-semibold">
            {isFirst && '"You are the champion, my friend!" 👑'}
            {!isFirst && dailyRank === 2 && '"Silver medal today! So close to gold!" 🥈'}
            {!isFirst && dailyRank === 3 && '"Bronze brilliance! Keep climbing!" 🥉'}
            {!isFirst && dailyRank && dailyRank > 3 && '"Top 10 finish - you\'re a star!" ⭐'}
            {!dailyRank && alltimeRank && '"Making history! What a score!" 📜'}
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
        >
          View Full Leaderboard 🎯
        </button>
      </div>
    </div>
  );
}
