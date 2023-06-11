import Styles from "./App.module.scss";
import PlayArea from "./cmps/PlayArea/PlayArea.cmp";

function App() {
  return (
    <div className={Styles.App}>
      <PlayArea />
    </div>
  );
}

export default App;
