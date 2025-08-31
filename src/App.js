import { useRef, useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [meldinger, setMeldinger] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  function sendMelding(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setMeldinger([...meldinger, { role: "bruker", content: input }]);
    setInput("");
  }

  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meldinger]);

  return (
    <div className="App">
      <div className="Boks">
          <div className="Chat">
            {meldinger.map((melding, index) => 
              (<p key={index}> {melding.content} </p>))}
            <div ref={bottomRef}></div> 
          </div>
          <div className= "Skrivefelt">
            <input
            value = {input}
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
              sendMelding(e);
            }}}
            placeholder = "Spør meg hva som helst"></input>
            <button onClick = {sendMelding} >Send</button>
            
          </div>
      </div>
    </div>
  );
}
