import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function PollResults() {
  const [pollId, setPollId] = useState<number>(-1);
  const [pollIdInput, setPollIdInput] = useState<string>("");

  const { data, isLoading, error: contractError } = useScaffoldReadContract({
    contractName: "VotingContract", 
    functionName: "getResults",
    args: [BigInt(pollId)],
  });

  const { data: pollDetails } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollDetails",
    args: [BigInt(pollId)],
  });

  const handlePollIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPollIdInput(value);

    if (value) {
      setPollId(Number(value));
    } else {
      setPollId(-1);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-xl shadow-2xl mx-auto max-w-4xl">
      <h3 className="text-3xl font-extrabold mb-6 text-center">Введите ID голосования для поиска</h3>

      <input
        type="number"
        placeholder="ID голосования"
        value={pollIdInput}
        onChange={handlePollIdChange}
        className="w-full p-3 mb-6 text-lg text-black rounded-xl border-2 border-blue-300 focus:border-blue-500 transition-colors duration-300"
      />

      {contractError && <p className="text-red-500 text-lg">Ошибка: не удалось получить данные для голосования.</p>}

      {isLoading && <p className="text-yellow-300">Загрузка...</p>}

      {pollId !== -1 && !isLoading && !contractError && (
        <div className="space-y-6">
          {pollDetails && (
            <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg">
              <h4 className="text-2xl font-semibold mb-3">Вопрос:</h4>
              <p>{pollDetails[0]}</p>
              <h4 className="text-2xl font-semibold mb-3 mt-6">Время завершения:</h4>
              <p>{new Date(Number(pollDetails[2]) * 1000).toLocaleString()}</p>
              <h4 className="text-2xl font-semibold mb-3 mt-6">Статус:</h4>
              <p className={`text-lg font-medium ${pollDetails[3] ? 'text-green-400' : 'text-red-400'}`}>
                {pollDetails[3] ? "Активно" : "Завершено"}
              </p>
            </div>
          )}

          {data && (
            <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-xl">
              <h4 className="text-2xl font-semibold mb-4">Результаты голосования:</h4>
              <ul>
                {data[0].map((option: string, idx: number) => (
                  <li key={idx} className="text-lg mb-4">
                    <span className="font-semibold">{option}</span>: {Number(data[1][idx])} голосов
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!data && (
            <p className="text-yellow-300 text-lg">Голосование с таким ID не найдено или не завершено.</p>
          )}
        </div>
      )}
    </div>
  );
}

