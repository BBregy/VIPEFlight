import React from "react";

export default (props) => {
   return <div className="card">
        <h5 className="card-header bg-info text-white"><img className="imagenTitulo" src="../images/wallet.png" width="50" height="50"></img>{props.title}</h5>
        <div className="card-body">            
            <div className="card-text">{props.children}</div>            
        </div>
    </div>
}
