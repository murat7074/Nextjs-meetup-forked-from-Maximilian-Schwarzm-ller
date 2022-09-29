// import { useEffect, useState } from 'react';
import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';

function HomePage(props) {
  // "getStaticProps" ı kullanınca aşağıdaki kodlara gerek kalmadı
  //  const [loadedMeetups, setLoadedMeetups] = useState([])
  //   useEffect(()=>{
  // // send a http request and fetch data
  //  setLoadedMeetups(DUMMY_MEETUPS)
  //   },[])

  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="description" content="Browse a huge list of highly active react meetups!"/>
      </Head>

      <MeetupList meetups={props.meetups} />
      
    </Fragment>
  );
}

// export async function getServerSideProps(context){ // her request de pre-render edilecek
// // fetch or read data
// const req = context.req  // istersek bu bilgilere erişebiliriz
// const res = context.res  // istersek bu bilgilere erişebiliriz
//   return {
//     props:{
//       meetups:DUMMY_MEETUPS
//     }
//   }
// }

export async function getStaticProps() {
  // sadece "pages" klasörü içinde çalışır.
  // fetch or read data

  const client = await MongoClient.connect(
    'USE YOUR MONGODB ACCOUNT'
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        // map lemezsek hata veriyor
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(), // mongodb deki _id yi convert ediyoruz
      })),
    },
    revalidate: 10, // sadece başlangıç build de değil 10 saniyede bir regenerated edilecek
  };
}

export default HomePage;

// const DUMMY_MEETUPS = [
//   {
//     id: 'm1',
//     title: 'A first meetup',
//     image:
//       'https://www.klasiksanatlar.com/img/sayfalar/b/1_1598452306_resim.png',
//     address: 'Some address 6, istanbul',
//     description: 'This is a first meetup',
//   },
//   {
//     id: 'm2',
//     title: 'A second meetup',
//     image:
//       'https://www.klasiksanatlar.com/img/sayfalar/b/1_1598452306_resim.png',
//     address: 'Some address 6, Ankara',
//     description: 'This is a second meetup',
//   },
// ];
