import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function HasUserVoted({ pollId }: { pollId: bigint }) {
  const [userAddress, setUserAddress] = useState<string>("");
  const { address, isConnected } = useAccount();

  // Хук для проверки, проголосовал ли пользователь
  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "hasUserVoted",
    args: [pollId, userAddress],
  });

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (hasVoted === undefined) return <p className="text-gray-300">Загрузка...</p>;

  return (
    <div className="mt-6 p-6 rounded-lg shadow-lg bg-blue-600 text-white">
      {hasVoted ? (
        <p className="text-lg">Вы уже проголосовали в этом голосовании.</p>
      ) : (
        <p className="text-lg">Вы ещё не проголосовали в этом голосовании.</p>
      )}
    </div>
  );
}
