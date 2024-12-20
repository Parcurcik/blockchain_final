import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function EndPoll({ pollId }: { pollId: bigint }) {
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const handleEndPoll = async () => {
    try {
      await writeContractAsync({
        functionName: "endPoll",
        args: [pollId],
      });
      alert("Голосование успешно завершено!");
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при завершении голосования.");
    }
  };

  return (
    <div className="mt-6 bg-red-600 text-white p-6 rounded-lg shadow-xl">
      <h4 className="text-2xl font-semibold mb-4">Завершить голосование</h4>
      <p className="text-lg">Вы уверены, что хотите завершить голосование?</p>
      <button
        onClick={handleEndPoll}
        disabled={isMining}
        className={`mt-4 px-8 py-3 rounded-lg text-xl font-bold ${isMining ? "bg-gray-500" : "bg-red-800 hover:bg-red-900"} transition`}
      >
        {isMining ? "Завершается..." : "Завершить голосование"}
      </button>
    </div>
  );
}
