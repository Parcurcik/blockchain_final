// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Election {
        string title;  // Название выборов
        string query;  // Запрос (вопрос) выборов
        string[] choices;  // Варианты ответа
        mapping(uint => uint) votesCount;  // Количество голосов за каждый вариант
        mapping(address => bool) participants;  // Учет голосующих
        uint finishTime;  // Время завершения выборов
        uint createdAt;  // Время создания выборов
        bool active;  // Статус активности выборов
        address organizer;  // Организатор выборов
    }

    Election[] public elections;

    // Событие, которое будет срабатывать при создании нового голосования
    event ElectionCreated(uint indexed electionId, string title);

    // Событие при голосовании
    event Voted(address indexed voter, uint indexed electionId, uint choice);

    // Создаем новое голосование с уникальным названием.
    function initiateElection(string memory _title, string memory _query, string[] memory _choices, uint _duration) public {
        require(_choices.length > 1, "There must be at least two possible options");
        require(_duration > 0, "The duration must be greater than zero");

        Election storage newElection = elections.push();
        newElection.title = _title;  // Название голосования
        newElection.query = _query;
        newElection.choices = _choices;
        newElection.finishTime = block.timestamp + _duration;
        newElection.createdAt = block.timestamp;  // Устанавливаем время создания
        newElection.active = true;
        newElection.organizer = msg.sender;

        emit ElectionCreated(elections.length - 1, _title);  // Эмитим событие создания выборов
    }

    // Голосование
    function voteInElection(uint _electionId, uint _choice) public {
        require(_electionId < elections.length, "Election does not exist");
        Election storage election = elections[_electionId];

        // Проверка, что голосование активно и не завершено
        require(election.active, "Election is no longer active");
        require(block.timestamp < election.finishTime, "Election has ended");
        require(!election.participants[msg.sender], "You have already voted");

        require(_choice < election.choices.length, "Invalid option");

        election.votesCount[_choice]++;  // Увеличиваем счетчик голосов за выбранный вариант
        election.participants[msg.sender] = true;  // Отмечаем, что пользователь проголосовал

        emit Voted(msg.sender, _electionId, _choice);  // Эмитим событие голосования
    }

    // Завершение голосования
    function concludeElection(uint _electionId) public {
        require(_electionId < elections.length, "Election does not exist");
        Election storage election = elections[_electionId];

        require(election.active, "Election is not active");
        require(block.timestamp >= election.finishTime, "Election is still ongoing");
        require(msg.sender == election.organizer, "Only the organizer can conclude the election");

        election.active = false;  // Завершаем голосование
    }

    // Получение информации о голосовании
    function getElectionInfo(uint _electionId) public view returns (string memory title, string memory query, string[] memory choices, uint finishTime) {
        require(_electionId < elections.length, "Election does not exist");
        Election storage election = elections[_electionId];
        return (election.title, election.query, election.choices, election.finishTime);
    }

    // Получение количества голосов для каждого варианта ответа в голосовании.
    function getVotes(uint _electionId) public view returns (uint[] memory votes) {
        require(_electionId < elections.length, "Election does not exist");
        Election storage election = elections[_electionId];
        uint[] memory voteCounts = new uint[](election.choices.length);

        for (uint i = 0; i < election.choices.length; i++) {
            voteCounts[i] = election.votesCount[i];
        }

        return voteCounts;
    }
}
