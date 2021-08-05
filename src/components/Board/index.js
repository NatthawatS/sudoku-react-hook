import React from "react";
import Cell from "../Cell";

const Board = ({ validate }) => {
  //   const [board, setBoard] = React.useState([
  //     [1, 2, 3, 4],
  //     [3, 4, 0, 0],
  //     [2, 0, 4, 0],
  //     [4, 0, 0, 2],
  //   ]);

  //   const [initial, setInitial] = React.useState([
  //     [true, true, true, true],
  //     [true, true, false, false],
  //     [true, false, true, false],
  //     [true, false, false, true],
  //   ]);

  const [board, setBoard] = React.useState([]);
  const [initial, setInitial] = React.useState([]);
  const [statusText, setStatusText] = React.useState("");
  const [seconds, setSeconds] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [realTime, setRealTime] = React.useState(true);

  React.useEffect(() => {
    let interval;
    if (realTime) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [realTime]);

  React.useEffect(() => {
    fetch(
      "https://us-central1-skooldio-courses.cloudfunctions.net/react_01/random"
    )
      .then((res) => {
        return res.json();
      })
      .then((jsonResponse) => {
        setBoard(jsonResponse.board);
        setSeconds(0);
        setInitial(
          jsonResponse.board.map((row) => row.map((item) => item !== 0))
        );
        setRealTime(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSubmit = () => {
    const isValid = validate(board);
    setRealTime(false);
    setStatusText(isValid ? "Board is complete!!" : "Board is invalid");
  };
  
  const onRestart = () => {
    setLoading(true);
    fetch(
      "https://us-central1-skooldio-courses.cloudfunctions.net/react_01/random"
    )
      .then((res) => {
        return res.json();
      })
      .then((jsonResponse) => {
        setBoard(jsonResponse.board);
        setSeconds(0);
        setInitial(
          jsonResponse.board.map((row) => row.map((item) => item !== 0))
        );
        setRealTime(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <p className="timer">Elapsed Time: {seconds} seconds</p>
      <div className="board">
        {!loading &&
          board.map((row, i) =>
            row.map((number, j) => (
              <Cell
                key={`cell-${i}-${j}`}
                number={number}
                isInitial={initial[i][j]}
                onChange={(newNumber) => {
                  if (!realTime) {
                    setRealTime(true);
                  }
                  board[i][j] = newNumber;
                  setBoard([...board]);
                }}
              ></Cell>
            ))
          )}
      </div>
      <button className="restart-button" onClick={() => onRestart()}>
        Restart
      </button>
      <button onClick={() => onSubmit()}>Submit</button>
      <p>{statusText}</p>
    </div>
  );
};
export default Board;
