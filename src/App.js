import React, { Component } from "react";
import Panel from "./Panel";
import Panel2 from "./Panel2";
import Panel3 from "./Panel3";
import Panel4 from "./Panel4";
import getWeb3 from "./getWeb3";
import AirlineContract from "./airline";
import { AirlineService } from "./airlineService";

const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            account: undefined,
            flights: [],
            customerFlights: [],
            refundableEther: 0
        };
    }

    async componentDidMount() {
        this.web3 = await getWeb3();
        this.toEther = converter(this.web3);
        this.airline = await AirlineContract(this.web3.currentProvider);
        this.airlineService = new AirlineService(this.airline);
     
        var account =(await this.web3.eth.getAccounts())[0];

        this.web3.currentProvider.publicConfigStore.on('update', async function(event) {
            this.setState({
                account: event.selectedAddress.toLowerCase()
            }, () => {
                this.load();
            });
        }.bind(this));

        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.load();
        });
    }

    async obtenerBalance() {
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        this.setState({
            balance: this.toEther(weiBalance)
        });
    }

    async getFlights() {
        let flights = await this.airlineService.getFlights();
        this.setState({
            flights
        });
    }

    async getRefundableEther() {
        let refundableEther = this.toEther(await this.airlineService.getRefundableEther(this.state.account));
        this.setState({
            refundableEther
        })
    }

    async refundLoyaltyPoints() {
        await this.airlineService.redeemLoyaltyPoints(this.state.account);
    }

    async getCustomerFlights() {
        let customerFlights = await this.airlineService.getCustomerFlight(this.state.account);
        this.setState({
            customerFlights
        });
    }

    async buyFlight(flightIndex, flight) {
        await this.airlineService.buyFlight(
            flightIndex, 
            this.state.account, 
            flight.price);    
    }

    async load() {
        this.obtenerBalance();
        this.getFlights();
        this.getCustomerFlights();
        this.getRefundableEther();
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron1">
                <h3 className="display-5"> <img className="imagenTitulo" src="../images/logo-icon-flau.png"></img>VIPE FLIGHT SCANNER</h3>
                <p className="lead">Plataforma de compra de billetes mediante smart contract</p>
            </div>

            <div className="row">            
                <div className="col-sm">
                    <Panel title="Tu cuenta">
                        <span><strong>Cuenta: </strong>{this.state.account}</span><br></br> 
                        <span><strong>Saldo disponible: </strong>{this.state.balance} <strong>ETH</strong></span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel2 title="Puntos de fidelidad">
                        <div id="caja">
                            <div id="loyalty">
                                <h2>Puntos</h2>
                                <p>{this.state.refundableEther} <strong>ETH</strong></p>
                            </div>
                            <div id="botonRefund">
                                <button className="btn btn-lg btn-success text-white"
                            onClick={this.refundLoyaltyPoints.bind(this)}>Canjear</button>
                            </div>                            
                        </div>                        
                    </Panel2>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel3 title="Vuelos disponibles">
                        {this.state.flights.map((flight, i) => {
                            return <div key={i}>
                                <div id="caja">
                                    <div id="info">
                                        <div id="imagen"> <img src={'../images/' + flight.company + '.jpg'} width="100" height="100"></img></div>
                                        <div id="hora">
                                            <h2>Hora</h2>
                                            <p>{flight.horaSalida}</p>
                                        </div>
                                        <div id="destino">
                                            <h2>Destino</h2>
                                            <b>{flight.name}</b>
                                        </div>
                                    </div>
                                    <div id="price">
                                        <h2>Precio</h2>
                                        <p>{this.toEther(flight.price)} ETH</p>
                                        <button className="btn btn-sm btn-success text-white" onClick={() => this.buyFlight(i, flight)}>Comprar vuelo</button>
                                    </div>                                    
                                </div>                                  
                            </div>
                        })}
                    </Panel3>
                </div>
                <div className="col-sm">
                    <Panel4 title="Tus vuelos">
                         {this.state.customerFlights.map((flight, i) => {
                            return <div key={i}>
                                <div id="cajaVuelos">
                                    
                                    <div id="imagen"> <img src={'../images/' + flight.company + '.jpg'} width="100" height="100"></img></div>
                                        <div id="tuDestino">                                            
                                            <span><b>Destino: </b></span>{flight.name}
                                        </div>
                                        <div id="tuHora">                                            
                                        <span><b>Hora: </b></span>{flight.horaSalida}
                                        </div>
                                    
                                </div>                                
                            </div>
                         })}       
                    </Panel4>
                </div>
            </div>
        </React.Fragment>
    }
}