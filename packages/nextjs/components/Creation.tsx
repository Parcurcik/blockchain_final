import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreatePoll() {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const addOption = () => {
    if (optionInput.trim()) {
      setOptions((prevOptions) => [...prevOptions, optionInput.trim()]);
      setOptionInput("");
      setError(""); 
    }
  };

  const removeOption = (index: number) => {
    setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    return question.trim() && options.length > 1 && duration > 0;
  };

  const createPoll = async () => {
    if (validateForm()) {
      setError(""); 
      setIsFormValid(true);
      await writeContractAsync({
        functionName: "createPoll",
        args: [question, options, BigInt(duration.toString())],
      });
    } else {
      setIsFormValid(false);
      setError("Пожалуйста, заполните все поля корректно.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Создание голосования</h2>

      <input
        type="text"
        placeholder="Введите вопрос"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-4 mb-6 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      />

      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Добавить вариант"
          value={optionInput}
          onChange={(e) => setOptionInput(e.target.value)}
          className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <button
          onClick={addOption}
          className="ml-4 bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors duration-300 hover:bg-blue-600 focus:outline-none"
        >
          Добавить
        </button>
      </div>

      {options.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Варианты ответа</h3>
          <ul className="space-y-2">
            {options.map((opt, idx) => (
              <li
                key={idx}
                className="text-lg text-gray-700 p-4 border-2 border-gray-300 rounded-lg transition-all duration-300 hover:bg-blue-100"
              >
                <span className="text-gray-700 font-medium">{opt}</span>
                <button
                  onClick={() => removeOption(idx)}
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Длительность (в секундах)
        </label>
        <input
          type="number"
          placeholder="0"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>

      {!isFormValid && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <button
        onClick={createPoll}
        disabled={isMining}
        className={`w-full py-3 rounded-lg text-white transition-all duration-300 ${
          isMining ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isMining ? "Создание..." : "Создать голосование"}
      </button>
    </div>
  );
}
