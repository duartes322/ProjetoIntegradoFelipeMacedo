export default function Card({_id, cardstatus, owner, createdAt }){

    async function cardUpdate(ev){
        ev.preventDefault();
        var newcardstatus = 'Nao solicitada';
        
        if (cardstatus === 'Não solicitada') {
            newcardstatus = 'Solicitada';
        }else if(cardstatus === 'Solicitada'){
            newcardstatus = 'Produzida';
        }else if(cardstatus === 'Produzida'){
            newcardstatus = 'Enviada ao solicitante';
        }else{
            newcardstatus = 'Enviada ao solicitante';
            alert('Carteirinha enviada ao solicitante!');
        }
        const response = await fetch('http://localhost:4000/cards/'+_id, {
            method: 'PUT',
            body: JSON.stringify({ cardstatus: newcardstatus }),
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        console.log('OK');
        document.location.reload();
    }
        
    
    return(
        <div className='cards'>
            <div className='owner'>
                <p>Usuário: {owner.username}</p>
            </div>
            <div className='cardstatus'>
                <p>Situação: {cardstatus}</p>
            </div>
            <button onClick={cardUpdate}>Atualizar</button>
        </div>
    );
}