import Masonry from 'react-masonry-css'
import ArweaveImage from "../components/ArweaveImage";
import './Grid.css';


export default function CryptoInGrid({ activities, columnCount = 3 }) {

    return <Masonry
                className="activities"
                columnClassName="activity-column"
                breakpointCols={columnCount}
            >
                {activities.map((activity, index) => {
                return <div className="activity-item" key={index}>
                    {activity.imageURI && <img src={activity.imageURI} />}
                    {activity.content}
                </div>
                })}  
            </Masonry>
  }