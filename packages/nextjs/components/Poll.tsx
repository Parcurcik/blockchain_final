import { useState, useEffect } from "react";
import EndPoll from "~~/components/EndPoll";
import HasUserVoted from "~~/components/DidUserVote";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function PollList() {
  const [polls, setPolls] = useState<any[]>([]);

  // Чтение количества существующих голосований
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollCount",
  });

  // Загружаем список голосований
  useEffect(() => {
    if (pollCount) {
      const fetchPolls = async () => {
        const newPolls = [];
        for (let i = 0; i < pollCount; i++) {
          newPolls.push(<PollItem key={i} pollId={BigInt(i)} />);
        }
        setPolls(newPolls);
      };

      fetchPolls();
    }
  }, [pollCount]);

  return (
    <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-4xl font-semibold mb-8 text-center text-gray-700">Все голосования</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {polls.length > 0 ? polls : <p className="text-xl text-center text-gray-600">Нет активных голосований</p>}
      </div>
    </div>
  );
}

function PollItem({ pollId }: { pollId: bigint }) {
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollDetails",
    args: [pollId],
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  if (!data) return <p className="text-gray-400">Загрузка...</p>;

  const [question, options, , isActive] = data;

  const pollIdStr = pollId.toString();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{question}</h3>
      <p className="text-lg text-gray-600 mb-4">
        <span className="font-semibold">ID голосования:</span> <span className="text-indigo-600">{pollIdStr}</span>
      </p>
      <ul className="space-y-4">
        {options.map((opt: string, idx: number) => (
          <li key={idx} className="flex justify-between items-center">
            <span className="text-lg text-gray-700">{opt}</span>
            {isActive && (
              <button
                onClick={() =>
                  writeContractAsync({
                    functionName: "vote",
                    args: [BigInt(pollId), BigInt(idx)],
                  })
                }
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Голосовать
              </button>
            )}
          </li>
        ))}
      </ul>
      {!isActive && <p className="text-red-500 text-lg mt-4">Голосование завершено</p>}
      {isActive && <EndPoll pollId={pollId} />}
      <HasUserVoted pollId={pollId} />
    </div>
  );
}
