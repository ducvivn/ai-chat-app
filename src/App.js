import { useRef, useState, useEffect } from "react";
import "./App.css";
const OPENAI_KEY = process.env.OPENAI_KEY;

async function hentAiSvar(spørsmål) {
  //forespørsel til openAI sitt API
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    
    method: "POST",
    headers: {
      "Content-Type": "application/json", // sender til JSON
      Authorization: `Bearer ${OPENAI_KEY}`, //API nøkkelen
    },
    
    body: JSON.stringify({
      model: "gpt-4o-mini", //AI modell versjon 4 mini
      messages: [{ role: "user", content: spørsmål }], //spørsmål fra brukeren
    }),
  });

  const data = await res.json(); //svaret om til JSON objekt
  console.log("Svar fra AI:", data); //logg
  
  //returnerer innholdet, returner hvis man ikke har fått svar fra AI
  return data?.choices?.[0]?.message?.content ?? "ingen svar"; 
}

export default function App() {
  //state, for alle meldinger i chatten
  const [meldinger, setMeldinger] = useState([]);
  
  //bruker state for inputet til brukeren, dette er for tekstfeltet
  const [input, setInput] = useState("");
  
  //peker som er nederst på bunnen av chatten, null, dette er for å scrolle ned
  const bottomRef = useRef(null);
  
  //bruker state for instant scroll ned knapp, for at den skal vises bare når man scroller opp
  const [showButton, setShowButton] = useState(false);
  
  //funksjonen scroller helt ned til chatten
  function scrollToBottom() {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  
  //funksjon for å sende melding, bruker apien for å svar tilbake fra AI-en
  async function sendMelding(e) {
  
    //sånn at siden ikke refresher hver gang man sender en melding 
    e.preventDefault();
    if (!input.trim()) return;
  
    //langrer meldingen for brukeren
    const bruker = { role: "Bruker", content: input };

    //setmeldinger legger den i chatten
    setMeldinger([...meldinger, bruker]);

    //lagrer spørsmålet her, dette er for å sende inn i parameteren til hentAisvar
    const spørsmålet = input; 
    setInput("");

    try {
      //sender spørsmålet her, og henter og lagrer ai svaret her.
      const aiSvar = await hentAiSvar(spørsmålet);
      //putter svaret i chatten , setter rollen som AI, og putter inn svaret i content. 
      setMeldinger((prev) => [...prev, { role: "Ai", content: aiSvar }]);
      //catcher error, feilmelding hvis det er 
    } catch (error) {
      console.error(error);
      setMeldinger((prev) => [
        ...prev,
        { role: "Ai", content: "feilmedling error" },
      ]);
    }
  }
  
  //bruker use effekt her, når meldingene oppdateres, så scroller den automatisk til bunnen
  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meldinger]);

  //use effekten her sjekker om brukeren skroller opp, hvis så, vis skroll ned instant knappen. 
  useEffect(() => {
  const chat = document.querySelector(".Chat");
  
  chat.addEventListener("scroll", () => {
    //hvis ikke nederst hvis knappen, ellers skjule. Bruker true eller false verdien for å vise eller skjule 
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
