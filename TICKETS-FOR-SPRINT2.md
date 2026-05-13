# Tickets for Sprint 2

Due to time constraints and other commitments, I decided not to implement the NASA NEO Feed integration outlined in the README-SPRINT2.md file. Instead, here are my thoughts about sprint 2.  I was thinking to create a separate subgraph for the NASA API and then stitch it into the existing schema, but I think that would be overkill for this use case since README-SPRINT2.md only requires one query to be added to the existing Yoga server.

From what I've learned of Yoga and GraphQL Mesh, here is what I imagine would be the tickets to implement the NASA NEO Feed integration for sprint 2.  I'll work through these tickets in more detail in the next few days to get a better understanding of how to implement this integration so I can be prepared to discuss it in the next interview.  Thanks again for the opportunity to work on this "homework" project, I really enjoyed it!

## Ticket 1

Install GraphQL Mesh and create a `data/nasa-neo-feed.json` file with a sample response from the NASA NEO Feed API. Implement a **GetNeoFeedData** handler that reads from the `data/nasa-neo-feed.json` file and returns the data in the same shape as the NASA API response.  Write tests to verify that the GetNeoFeed handler is working as intended. 

## Ticket 2

Configure Mesh via a `.meshrc.yml` file to use the **GetNeoFeed** handler as a source. Generate the Mesh SDK and verify that you can call the **GetNeoFeed** handler via the Mesh SDK.  Use query parameters start_date, end_date, and api_key to filter the data in the `data/nasa-neo-feed.json` file.  Write tests to verify that the Mesh SDK is correctly filtering the data based on the query parameters.

## Ticket 3

Create a new `.src/schema/neo.graphql` file. Add necessary types `.src/types/index.ts` file. Extend Query in `.src/schema/neo.graphql` with **nearEarthObjects(start_date: String!, end_date: String!, api_key: String!): NeoFeedResponse** to receive raw data from the Mesh SDK to flatten **near_earth_objects** into a single array of **NearEarthObject** items.  Write tests to verify that the nearEarthObjects query is working as intended and that the data is being correctly flattened.

## Ticket 4

Create a resolver for the **nearEarthObjects** query that calls the Mesh SDK to retrieve data from the GetNeoFeed handler.  Write tests to verify that the resolver is correctly calling the Mesh SDK and returning the expected data.
