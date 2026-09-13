import "./BirthdayMessage.css";

export default function BirthdayMessage({ config }) {
  const { heading, paragraphs, chips, signOff } = config.message;

  return (
    <section id="message" className="section message">
      <div className="message-card">
        <p className="eyebrow">❤️ The Message</p>
        <h2>{heading}</h2>
        <div className="message-body">
          {paragraphs.map((text) => (
            <p key={text.slice(0, 24)}>{text}</p>
          ))}
        </div>
        <div className="message-chips">
          {chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
        <p className="message-sign grad">{signOff}</p>
      </div>
    </section>
  );
}
