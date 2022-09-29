// import router, { useRouter } from 'next/router';
import MeetupDetail from '../../components/meetups/MeetupDetail';
import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

function MeetupDetails(props) {
  // const router = useRouter() // useRouter ı "getStaticProps" içinde kullanamayız zaten gerekte yok. getStaticProps daki "context.params" ile alıcaz

  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
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
  // dynamic page çağıracaksak "getStaticPaths" kullanmalıyız

  const client = await MongoClient.connect(
    'USE YOUR MONGODB ACCOUNT'
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  // nextjs hangi sayfaları önceden pre-render edeceğini bilmeli
  // {_id:1} = bütün id ler gelicek ve dynamic olarak tanımlamış olucaz
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  // console.log(meetups)
  client.close();

  return {
    // "false" bütün dynamic sayfaları aşağıda tanımladım demek
    fallback: "blocking", 
    paths: meetups.map((meetup) => ({
      // id leri tek tek tanımlamalıyız
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup
  // const meetupId = router.query.meetupID // useRouter ı "getStaticProps" içinde kullanamayız zaten gerekte yok

  const meetupId = context.params.meetupId; //"meetupId" dosya adı ile aynı olmalı "[meetupId].js"
  console.log(meetupId); // terminalde görüncek browserda değil

  const client = await MongoClient.connect(
    'USE YOUR MONGODB ACCOUNT'
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  // sadece istenen id gelicek
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  }); // "ObjectId" mongodb den import ediyoruz
  // console.log(meetups)

  client.close();

  return {
    // single page de (MeetupDetails.js) aşağıdaki bilgiler sergileniyor
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;

// getStaticPaths da yukarıda "return" u dynamic yapıcaz(diğer türlü bütün id leri tek tek yazmalıyız)
//   return {
//     fallback: false, // "false" bütün dynamic sayfaları aşağıda tanımladım demek
//     paths: [
//       {
//         params: {
//           meetupId: 'm1',
//         },
//       },
//       {
//         params: {
//           meetupId: 'm2',
//         },
//       },
//     ],
//   };
// }
