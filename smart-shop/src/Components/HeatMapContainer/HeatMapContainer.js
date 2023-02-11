import { ActionList } from "../ActionList/ActionList";
import { HeatMap } from "../HeatMap/HeatMap";

export function HeatMapContainer(props) {
  return (
    <div style={{display: 'flex',flexGrow: 2}}>
      <div style={{flexGrow: 1}}>
        <div>
          Subdomain Here
        </div>
        <div>
          <HeatMap mousePos={props.pagesData[0].mousePos} bWidth={props.bWidth}></HeatMap>
        </div>
        <div>
          <button>Subdomain Btn</button>
        </div>
      </div>
      <ActionList></ActionList>
    </div>
  );
}