import { Button } from "antd";
import { useEffect, useState } from "react";

export default function FollowBtn({ cyberConnect, address, followeds, getFollowers }) {

    const [followed, setFollowed] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);


    useEffect(() => {
        if (followeds && followeds.indexOf(address) > -1) {
            setFollowed(true);
        }
    }, [followeds])

    const follow = async () => {
        setFollowLoading(true);
        if (followed) {
            await cyberConnect.connect(address);
        } else {
            await cyberConnect.disconnect(address);
        }
        await getFollowers();
        setFollowLoading(false);
    }

    return <Button 
                type={followed ? 'secondary' : 'primary'}
                onClick={follow}
                loading={followLoading}
            >
                {followed ? 'Following' : 'Follow'}
            </Button>
}