import { useEffect, useState } from "react";
import Card from "../Card";

export default function AdminPage(){
    const [cards,setCards] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/cards').then(response => {
            response.json().then(cards => {
                setCards(cards);
            });
        });
    },[]);
    return (
        <>
          <div className='admin'><h1>Admin</h1></div>
          {cards.length > 0 && cards.map(card => (
            <Card {...card} />
          ))}
        </>
    );
}
