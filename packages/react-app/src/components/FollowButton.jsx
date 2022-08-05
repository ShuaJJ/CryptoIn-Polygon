import { Button } from "antd";
import { useEffect, useState } from "react";

export default function FollowBtn({ cyberConnect, address, followeds }) {

    const [followed, setFollowed] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);


    useEffect(() => {
        if (followeds && followeds.indexOf(address) > -1) {
            setFollowed(true);
        }
    }, [followeds])

    const follow = async () => {
        setFollowLoading(true);
        try {
            if (followed) {
                await cyberConnect.disconnect(address);
            } else {
                await cyberConnect.connect(address);
            }
        } catch(e) {
            console.log('Follow Error', e);
        }
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