# Crypto On-chain data Visualization Dashboard

This is the dashboard app to visualize on-chain data.
Aiming to build an app to import CSV file from Polygonscan to visualize user's transactions as a first stage.

Deployed on Vercel: [Cripty dashboard](https://crypto-dashboard-coral.vercel.app/)
test user: user@nextmail.com, Pass: 123456

## Highlights
- Next.js App Router for building applications using Server Components, Streaming with Suspense, and Server Actions.
- Nested layouts and pages using file-system routing.
- The different ways to style the application in Next.js.
- Set up a database on Vercel.
- Mutate data using React Server Actions, and revalidate the Next.js cache.
- Add authentication to your application using NextAuth.js and Middleware.
- Parsing CSV files for processing dataset by Papaparse in the application.


## Main Functionality
### Sign-in & Sign-up
![Screen Shot 2024-04-03 at 09 58 52](https://github.com/ShinShin801/crypto-dashboard/assets/59970261/bb8f4a43-0c2b-4e28-8e3c-d02d0a9e36b6)



### Overview Dashboard
- Score Card to show Matic balance and the number of Txs of the favorite address based on imported Txs data.
- Score Card to show total address registered by the user.
- Chart to show user's matic balance in last 12 months.
- Showing Latest Txs of favorite address based on the imported data.
![Screen Shot 2024-04-03 at 09 59 36](https://github.com/ShinShin801/crypto-dashboard/assets/59970261/200676cd-8866-40f1-9ba6-fc3a1ff9fa67)



### Importing Data
- Upload transaction Csv file downloaded from [Polygonscan](https://polygonscan.com/)
- Might take a while to import data if the file is too large. (Due to the limitation of the database)
![Screen Shot 2024-04-03 at 10 00 07](https://github.com/ShinShin801/crypto-dashboard/assets/59970261/9dad0a3d-78d2-4657-a0ec-4378f4ee5594)



### Registering wallets and Favorite wallet
![Screen Shot 2024-04-03 at 10 00 30](https://github.com/ShinShin801/crypto-dashboard/assets/59970261/ba4be1b4-9c0b-49a8-856f-851f0e49b758)




## Getting Started



## Reference

[Next.js App Router Course - Starter](https://nextjs.org/learn)
