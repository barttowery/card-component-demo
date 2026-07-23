# Card Component Demo

This demo code was created as part of an interview take home assignment. I will not list the assignment as a whole in case that company continues to use this assignment.

The key to the assignment is to create a reusable Card component and render 3 to 5 sample product cards in a demo. It must use design tokens applied using standard CSS. It must use semantic HTML and follow accessibility best practices.

## Technology/Packages Used
This project uses many tools like:

- [Nx](https://nx.dev) - Installing Nx globally (`npm add --global nx@latest`) allows you to avoid needing `npx` at the beginning of the below commands.
- [Node](https://nodejs.org/en/download) - Version 24+ required for Storybook 10
- [ReactJS](https://reactjs.org)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Storybook](https://storybook.js.org/)
- [Tanstack Query](https://tanstack.com/query/latest)
- [Axios](https://axios.rest/)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)

## Running the Project
- Start the API using `nx serve api`. The API runs at [http://localhost:3333](http://localhost:3333)
- Start the Web Application using `nx serve card-component-demo`. The Web Application runs at [http://localhost:4200](http://localhost:3333).

## Running Storybook
- For the shared-ui Storybook, run `nx storybook shared-ui`. This is the Storybook for the Shared Component Library.
- For the products-ui Storybook, run `nx storybook products-ui`. This is the Storybook for the products pages. In includes the content components for the products area with data passed in via props. The hooks to call the API are created and wired up in the products-feature package.

## Project Architecture

### Structure
Follows the Nx approach with apps and packages. This project is broken apart the way a large project should be broken apart to demonstrate the proper approach rather than what I would normal do on a task this size. The project is created following [Atomic Design](https://atomicdesign.bradfrost.com/) principles.

### Packages
This is the meat of the functionality. The following packages exist.
- products-feature (`/packages/products-feature`) - Contains the product routes, hooks for retrieving the data and the pages for products.
- products-ui (`/packages/products-ui`) - Contains the product UI components. All data is passed in via properties (makes unit testing better). Storybook is configured and can be run via `nx storybook products-ui`.
- shared-models (`/packages/shared-models`) - Contains the models for the product (i.e. ProductSummary).
- shared-ui (`/packages/shared-ui`) - The shared component library for the solution. This is the bulk of the actual assignment given. Includes Jest testing. Storybook is configured and can be run via `nx storybook shared-ui`. These are intended to be shared components that could be used across multiple web sites. 
- shared-utils (`/packages/shared-utils`) - Contains a ThemeProvider. One piece of the assignment was to apply design tokens to CSS properties in the application. The design tokens are set and applied via the ThemeProvider.

Note that in a larger project, I would create a shared folder to contain the models, ui and utils packages (along with other potentials such as data and mocks). Also each domain area such as products would have its own folder with packages underneath.

### API
A very simple Express app to send the products and product details. The data is hardcoded. Run the API by using `nx serve api`. This runs the API at [http://localhost:3333](http://localhost:3333).

### Web App
A React application that includes the top level routing and wraps the routed components in the Tanstack QueryClientProvider and the custom ThemeProvider. The routing details for products is retrieved from the `products-feature` package.

Note that I find it better in larger projects to push routing for domain areas into those packages. This allows domain areas to be owned by groups and prevents some merge conflicts. Run the web application by using `nx serve card-component-demo`. This runs the web application at [http://localhost:4200](http://localhost:3333).

## Shared Components

### ProductCard
A product card component that displays the image, title, description and price of the product.

Key Decisions:
- Debated between `<article>` and `<li>` tags as the wrapper for the card. Either could work from a semantic perspective. Since there is a chance the card would be displayed by itself and given that accessibility tests do not like `<li>` tags when there is no wrapping `<ul>`, I chose `<article>` and put the `<li>` as part of the product card list component.
- Passed the entire product object via a typed prop (ProductSummary) rather than separating the properties. I feel it keeps code cleaner unless there is good reason to separate the fields into individual properties.
- From a display perspective, we want the image at the top, but for screen readers, the product title is more important. In the HTML, the image is below the text to make the text more important to screen readers. I used the flexbox order property to push the display of the image above the text.
- While the image property is a required field, it is possible to pass an empty string to the component. I am handling that by displaying a div that says there is no product image instead of the image tag. A proper solution should determine how to handle situations where no real data is passed to the component. This would include the other fields included in the product. Currently, if a blank string is passed, then a blank string is displayed in the component.
- Responsiveness - The card will be between 240px and 360px. This will handle wider screens, mobile, etc. Other approaches could include different sizes of text or the image based on the screen size (i.e. mobile could use a smaller
font size than a desktop screen).
- Vertical Responsiveness - The card is set to a fixed height of 600px (to keep consistency). The image has a height of 250px and the title and price take up the required space. If the description is too long, it will add a vertical scrollbar (other options would be a text-ellipsis or limit lines, etc.).
- onProductClicked vs Router Navigate - The cards emit an onProductClicked event when the card is clicked rather than navigating directly via the link provided with the product. This makes the shared component more reusable by letting the consuming package decide how to navigate or react to the click. The actual navigation is handled via the Products component in the products-feature package.

### ProductCardList
Very simple unordered list that maps the products to the ProductCard component. The component contains a `<ul>` wrapper and creates a `<li>` tag with the ProductCard component for each product in the list.

## Unit Testing
As the assignment was focused on the reusable UI, I only added Jest testing to the shared-ui package. This can be run using `nx test shared-ui` or `nx test shared-ui --coverage` to regenerate the code coverage testing details. Current code coverage is 94% for Statements, 62% for Branches, 100% for Functions, and 100% for lines. More testing could be created around the keyboard navigation functionality to improve the branches percentage.

## CSS Theming
There is a React Context Provider created for the theming functionality. The `<ThemeProvider>` is used to pass in a theme. If no theme is provided, it applies the default theme (which matches the assignment's tokens). The web application contains a button in the header to toggle themes to demonstrate how the theme can be changed (i.e. this could be passed in from an API in the future). The code for the context and provider is in the shared-utils project.

## AI Agent Files
There are AI agent files in the monorepo. At this point, they are nothing more than the files added by Nx and the Nx Console extension. Rules and documentation should be added to provide proper instructions to agents for better use.
