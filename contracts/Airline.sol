pragma solidity ^0.5.16;

contract Airline {
    address public owner;
    
    struct Customer {
        uint loyaltyPoints;
        uint totalFligths;
    }

    struct Flight {
        string name;
        uint price;
        string company;
        string horaSalida;
    }

    uint etherPerPoint = 0.5 ether;

    Flight[] public flights;

    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customerFlights;
    mapping(address => uint) public customerTotalFlights;

    event VueloComprado(address indexed customer, uint price);

    constructor() public {
        owner = msg.sender;
        flights.push(Flight('Vancouver', 3 ether, 'Iberia', '8:00'));
        flights.push(Flight('Vancouver', 5 ether, 'Iberia', '14:00'));
        flights.push(Flight('Vancouver', 4 ether, 'Iberia', '20:00'));
        flights.push(Flight('Tokio', 2 ether, 'KLM', '10:00'));
        flights.push(Flight('Tokio', 3 ether, 'KLM', '14:00'));
        flights.push(Flight('Tokio', 4 ether, 'KLM', '19:00'));
        flights.push(Flight('Tokio', 3 ether, 'KLM', '23:00'));    
        flights.push(Flight('Madrid', 1 ether, 'Ryanair', '7:50'));
        flights.push(Flight('Madrid', 2 ether, 'Ryanair', '10:50'));
        flights.push(Flight('Madrid', 3 ether, 'Ryanair', '13:50'));
        flights.push(Flight('Madrid', 2 ether, 'Ryanair', '19:50'));
        flights.push(Flight('Madrid', 1 ether, 'Ryanair', '23:50'));
    }

    function comprarVuelo(uint flighIndex) public payable {
        Flight memory flight = flights[flighIndex];
        require(msg.value == flight.price);

        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalFligths += 1;
        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender] ++;
        emit VueloComprado(msg.sender, flight.price);
    }

    function totalVuelos() public view returns (uint) {
        return flights.length;
    }

    function convertirLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }
    
    function getBalanceAirline() public view returns (uint) {
        address airlineAddress = address(this);
        return airlineAddress.balance;
    }

    function getRefundableEther() public view returns (uint) {
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

}