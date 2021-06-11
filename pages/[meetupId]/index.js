import MeetupDetail from '../../components/meetups/MeetupDetail';
import { MongoClient, ObjectID } from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';

function MeetupDetails(props) {
    console.log('props', props);

    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta
                    name="description"
                    content={props.meetupData.description}
                />
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    );
}

export async function getStaticPaths() {
    const client = await MongoClient.connect(
        'mongodb+srv://user:12321@cluster0.pqx8t.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
    console.log('meetups', meetups);
    client.close();

    return {
        fallback: 'blocking',
        paths: meetups.map((meetup) => ({
            params: {
                meetupId: meetup._id.toString(),
            },
        })),
    };
}

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;
    console.log('meetupId', meetupId);

    //fetch data for a single meetup
    const client = await MongoClient.connect(
        'mongodb+srv://user:12321@cluster0.pqx8t.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({
        _id: ObjectID(meetupId),
    });

    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                description: selectedMeetup.description,
                image: selectedMeetup.image,
            },
        },
    };
}

export default MeetupDetails;
