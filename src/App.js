import { useRef, useState, useEffect } from "react";
import "./App.css";
const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;

async function hentAiSvar(spørsmål) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: spørsmål }],
    }),
  });

  const data = await res.json();
  console.log("Svar fra OpenAI:", data);
  return data?.choices?.[0]?.message?.content ?? "Fikk ikke noe svar 🤷‍♂️";
}

export default function App() {
  const [meldinger, setMeldinger] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const [showButton, setShowButton] = useState(false);

  function scrollToBottom() {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function sendMelding(e) {
  e.preventDefault();
  if (!input.trim()) return;

  const bruker = { role: "Bruker", content: input };
  setMeldinger([...meldinger, bruker]);

  const spørsmålet = input;  // 👈 definert nå
  setInput("");

  try {
    const aiSvar = await hentAiSvar(spørsmålet);
    setMeldinger((prev) => [...prev, { role: "Ai", content: aiSvar }]);
  } catch (error) {
    console.error(error);
    setMeldinger((prev) => [
      ...prev,
      { role: "Ai", content: "Oops, noe gikk galt 😅" },
    ]);
  }
}
  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meldinger]);

  useEffect(() => {
  const chat = document.querySelector(".Chat");

  chat.addEventListener("scroll", () => {
    if (chat.scrollTop + chat.clientHeight < chat.scrollHeight) {
      setShowButton(true);   
    } else {
      setShowButton(false);  
    }
  });
  }, []);


  return (
    <div className="App">
      <div className="Boks">
          <div className="Chat">
            {meldinger.map((melding, index) => (
              <p 
              key = {index}
              className = {melding.role}
              > {melding.content} </p>))}
            <div ref={bottomRef}></div> 
          </div>
          {showButton && <button className ="scrollButton" onClick={scrollToBottom}>⬇</button>}
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
