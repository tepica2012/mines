<script type="text/javascript">
const { useState } = React;

const PayoutMultipliers = [1.0, 1.12, 1.3, 1.6, 2.0, 2.6, 3.5, 4.8, 6.4, 8.3, 10.5];

function App() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [mines, setMines] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [lost, setLost] = useState(false);
  const [multiplier, setMultiplier] = useState(null);

  const startGame = () => {
    if (bet <= 0 || bet > balance) return;
    const mineSet = [];
    while (mineSet.length < 3) {
      const n = Math.floor(Math.random() * 25);
      if (!mineSet.includes(n)) mineSet.push(n);
    }
    setBalance(balance - bet);
    setMines(mineSet);
    setRevealed([]);
    setGameActive(true);
    setLost(false);
    setMultiplier(null);
  };

  const reveal = (index) => {
    if (!gameActive || revealed.includes(index)) return;

    const newRevealed = [...revealed, index];
    setRevealed(newRevealed);

    if (mines.includes(index)) {
      setGameActive(false);
      setLost(true);
      setMultiplier(PayoutMultipliers[newRevealed.length - 1] || 1.0);
    }
  };

  const cashOut = () => {
    const multi = PayoutMultipliers[revealed.length] || 1.0;
    setBalance(balance + Math.round(bet * multi));
    setGameActive(false);
    setMultiplier(multi);
  };

  return (
    React.createElement("div", { style: { textAlign: "center", padding: 20 } },
      React.createElement("h1", null, "Stake Mines Clone"),
      React.createElement("p", null, "Balance: $", balance),
      React.createElement("input", {
        type: "number", value: bet, onChange: e => setBet(parseInt(e.target.value)), disabled: gameActive
      }),
      React.createElement("button", { onClick: startGame, disabled: gameActive }, "Start"),
      gameActive && React.createElement("button", { onClick: cashOut }, "Cash Out"),
      React.createElement("div", { className: "grid" },
        Array.from({ length: 25 }, (_, i) =>
          React.createElement("div", {
            key: i,
            className: `tile ${revealed.includes(i) ? (mines.includes(i) ? "revealed red" : "revealed green") : ""}`,
            onClick: () => reveal(i)
          },
            revealed.includes(i)
              ? mines.includes(i)
                ? React.createElement("img", { src: "bomb.svg", width: 24 })
                : React.createElement("img", { src: "gem.svg", width: 20 })
              : ""
          )
        )
      ),
      multiplier !== null &&
        React.createElement("p", { style: { marginTop: 10 } },
          lost ? `💥 Lost at x${multiplier.toFixed(2)}` : `💰 Cashed out at x${multiplier.toFixed(2)}`
        )
    )
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(App));
</script>
