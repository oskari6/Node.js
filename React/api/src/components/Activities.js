import { useEffect, useState } from 'react';

function Activities(){
    function loadActivity(){
        setIsLoading(true)
        fetch("https://www.boredapi.com/api/activity")//api end point
            .then((response) => response.json())
            .then((data) => {
                setActivities([...activities, data])
                setIsLoading(false)
            });
    }

    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    //doing an effect hook
    useEffect(() => {loadActivity()
    }, []);

    if(activities.length == 0){
        return<p>Loading</p>
    }

    return (
    <div>
        <ul>
            {activities.map((activity) => {
                return <li key={activity.key}>{activity.activity}</li>
            })}
        </ul>
        <button disabled={isLoading} onClick={loadActivity}>Load Another</button>
    </div>
    );
}

export default Activities;