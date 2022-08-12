import { Button } from "antd";
import { useEffect, useState } from "react";

export default function FollowBtn({ address, followeds, cyberConnect }) {

    const [followed, setFollowed] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);


    useEffect(() => {
        if (followeds && followeds.indexOf(address.toLowerCase()) > -1) {
            setFollowed(true);
        }
    }, [followeds])

    const follow = async () => {
        setFollowLoading(true);
        try {
            console.log(address)
            if (followed) {
                await cyberConnect.disconnect(address);
                setFollowed(false);
            } else {
                await cyberConnect.connect(address);
                setFollowed(true);
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