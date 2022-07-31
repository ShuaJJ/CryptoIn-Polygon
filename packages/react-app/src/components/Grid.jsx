import Masonry from 'react-masonry-css'
import ArweaveImage from "../components/ArweaveImage";
import './Grid.css';


export default function CryptoInGrid({ activities, columnCount = 3 }) {

    return <Masonry
                className="activities"
                columnClassName="activity-column"
                breakpointCols={columnCount}
            >
                {activities.map((activity) => {
                return <div className="activity-item">
                    {activity.contents && <ArweaveImage txId={activity.contents[0].address[0]} />}
                    {activity.summary}
                </div>
                })}  
            </Masonry>
  }