# Polygon BUIDL IT : Summer 2022

## Track - Web3 version of LinkedIn

### CryptoIn is fully decentralized! No central servers are used!

Although currently Twitter is still the main social platform for crypto people, it’s still a web2 platform and crypto is just a small part of it. Second of all, without identity verification, there are lots of scammers pretending they are crypto professionals. So sometimes, people can connect with wrong person. There are not many decentralized features and technologies involved as well. Last but not least, nowadays in crypto, how can we miss earnings while using the app?

Also we don’t have an authenticated platform like LinkedIn in web3 where users can connect professionals or find a job. There are some job listing app in web3, however, talents in crypto such as web3 developers, they seem not likely to apply for a job through this kind of site with a resume. In web3, projects tend to hire the people they know or connected via friends. This is actually difficult in most of the time. If we can do this through a dapp, things would be faster and easier.

Here comes CryptoIn, a web3 professional social platform built with decentralized technologies! 

## Features & Design

### Professional Feeds & Messaging

Feeds and Messaging are fundamental features on most social platforms. However, our team still wants to make these fundamental features more interesting and attracting in CryptoIn. 

For messaging, the first thing, of course, we want to make it secure. Especially this is a crypto project, messages will be encrypted. Second of all, we will make it not that “easy” to chat with someone. Unless both of the users hold a same NFT, or one of them holds some special NFT from CryptoIn, the chat will happen then. This will prevent users from receiving spams. We would like to treat it as a different version of proof of work because we are gonna create some tasks and only people who complete all the tasks will be able to mint the NFTs.

For feeds, we will work on the design of it. While focusing on the frontend, we will also make some rules that what kind of images or contents users should post. In that case, the site will look smooth and elegant. Again, we will use NFTs mentioned above to control who can post feeds, which feeds will be featured, and how the feeds will rank.
In this case, we make the features more interesting to use, also prevent people from spamming others.

### Jobs & Talents

As mentioned above, currently crypto teams tend to hire people from referrals or connections. It’s not like web2, we can just simply post a job description and wait for resumes. Also some talents are actually not looking for jobs, they are working on their own projects or seeking cooperating opportunities.

To solve these problems, an authenticated professional platform like LinkedIn in web2 is necessary. There are some differences in web2 and web3 projects. In web2, people need to register a company first to start a projects. And to hire someone, they need to sign a lot of paper work. In web3, usually people just work together as a team, the project starts. And we are free in crypto, most people do not like all the contracts and paper work. So the way to check whether a project is real will be different as well.

We will build some tools to check the work this project has done, and the communities this project has built etc. After all these checks, this project will be verified in CryptoIn. Then they can post jobs or search talents.

For talents such as web3 developers, it’s even easier. Just post some professional feeds including working experience, any work they have done, skill sets, and what they are seeking. Later they will get connected with right projects!

### Events

So far, we haven’t seen a platform which is trying to organize all crypto events happening locally. As a professional social platform, CryptoIn will take this responsibility. In the beginning, when there are not a lot of users, our operating team will gather all crypto events information and post in CryptoIn. Later, project owners can post their own events. 

Here, we will integrate with POAP as an option setting when creating the event. People who apply and show up in the event can get the POAP, for example. Also to prevent people from spamming, we will implement another option integrated with zkSync so that the host can make the event not free, people will need to pay crypto currency when applying to the event.

Last but not least, attending events hosted on CryptoIn can earn tokens from CryptoIn as well. We will talk about this in 3.5.

### NFT Badges

Now comes to the innovative part of CryptoIn. We want to introduce our Badging system. This adds some gamification elements into this social platform.

We will carefully design a list of tasks, some of them are public, and some of them are secretly behind the scene. Users can read through the public ones and try to accomplish them, then they will get corresponding NFT Badges; or they can just use the app daily, and sometimes, if they are lucky enough, will trigger the secret ones to be minted.

With NFT Badges, it not only attracts people to use the app more often but also control the access of each user to the app. A good example would be the posts from people with “Brilliant Author” NFT Badges will be featured.

And an example of a task would be like this: apply to an event hosted on CryptoIn and attend it. In the event, scan a qrcode to prove you actually attend and sign the message to record it on chain, then you have proved you completed this task!

Of course, these badges will show up in users’ web3 profiles. Later, when CryptoIn becomes more popular, these badges can be treated as some identity verifications to other web3 apps. Also after CryptoInDAO is founded, people who hold certain badges will automatically become the members of it.

### Social To Earn

Here comes the important part, Social To Earn! Like we said above, how can a project miss earnings while people are using it? The way we are gonna implement this feature is actually through the NFT Badges as well.

After users completed several public & hidden tasks, they will be able to mint some special NFT Badges called Yield Badge. And with these badges in wallet, they can claim tokens in every certain period of time until an expiry date specified in that Badge. So they can try to complete more new tasks to get another yield badge.

An example of a yield badge would be: the owner of the badge can claim 1 token each day in the next two months or claim all the tokens at once later to save gas fee.
Therefore, there are a lot of advantages to own badges from CryptoIn. We believe the badging system will attract lots of users to social and have fun in CryptoIn!

### Decentralization

We really want to build a dapp that is fully decentralized, meaning no central servers will be used. All data are on-chain. To achieve this, we will integrate several awesome web3 projects into CryptoIn. Details are listed in next section.

In addition to all datas stored in blockchains, all the users actions will be logged using subgraph. So later, the app can be searched using GraphQL. As the example of a task indicates, if a user attends an event, this action will be emitted as an event in contract and stored in GraphQL node, and later this user can query all the event he/she attended.


## About Me
 
 1. My name is Joshua Jiang, and I am a solo developer in this Hackthon
 2. Graduate from University of Toronto and has been a web3 developer for 2+ years
 3. My Polygon wallet address is: 0x261DB4e5783Cecc65F05624C09fD37d4c883AD3f
 4. My Email address is: Sody008@gmail.com