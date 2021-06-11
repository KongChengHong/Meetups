import MongoClient from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

import MeetupList from '../components/meetups/MeetupList';

const DUMMY_MEETUP = [
    {
        id: '1',
        title: 'A first meetup',
        image: 'https://www.ox.ac.uk/sites/files/oxford/styles/ow_large_feature/s3/field/field_image_main/Elizabeth%20Nyikos%2C%20rooftops%20over%20Oxford%20%282%29.jpg?itok=MPLJqDmb',
        address: 'XXX',
        description: 'Meetup 1',
    },
    {
        id: '2',
        title: 'A first meetup',
        image: 'https://www.ox.ac.uk/sites/files/oxford/styles/ow_large_feature/s3/field/field_image_main/Elizabeth%20Nyikos%2C%20rooftops%20over%20Oxford%20%282%29.jpg?itok=MPLJqDmb',
        address: 'XXX',
        description: 'Meetup 2',
    },
];

const HamePage = (props) => {
    // const [loadedMeetup, setLoadedMeetup] = useState([]);
    // useEffect(() => {
    //     //fetch data
    //     setLoadedMeetup(DUMMY_MEETUP);
    // }, []);
    console.log('props', props);

    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta
                    name="description"
                    content="Highly active React Meetups"
                />
            </Head>
            <MeetupList meetups={props.meetups}></MeetupList>
        </Fragment>
    );
};

export async function getStaticProps() {
    //fetch data from mongoDB (without calling api)
    MongoClient.connect();

    const client = await MongoClient.connect(
        'mongodb+srv://user:12321@cluster0.pqx8t.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();
    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray(); //insert one document into meetupsCollection colleciton

    client.close();

    return {
        props: {
            meetups: meetups.map((meetup) => ({
                id: meetup._id.toString(),
                title: meetup.title,
                image: meetup.image,
                address: meetup.address,
                description: meetup.description,
            })),
        },
        revalidate: 1, //regenerate a new page if a new request is commming every xx sec.
    };
}

export default HamePage;
