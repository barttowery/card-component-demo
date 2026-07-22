# Card Component Demo

This demo code was created as part of an interview take home assignment. I will not list the assignment as a whole in case that company continues to use this assignment.

The key is a reusable Card component and render 3 to 5 sample product cards in a demo. It must use design tokens applied using standard CSS. It must use semantic HTML and follow accessibility best practices.

## Technology/Packages Used
This project uses many tools like:

- [Nx](https://nx.dev) - Installing Nx globally (`npm add --global nx@latest`) allows you to avoid using `npx` at the beginning of the below commands.
- [Node](https://nodejs.org/en/download) - Version 24+ required for Storybook 10
- [ReactJS](https://reactjs.org)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Storybook](https://storybook.js.org/)
- [Tanstack Query](https://tanstack.com/query/latest)
- [Axios](https://axios.rest/)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)

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
A very simple Express app to send the products and product details. The data is hardcoded. Run the API by using `nx serve api`. This runs the API on http://localhost:3333.

### Web App
A React application that includes the top level routing and wraps the routed components in the Tanstack QueryClientProvider and the custom ThemeProvider. The routing details for products is retrieved from the `products-feature` package.

Note that I find it better in larger projects to push routing for domain areas into those packages. This allows domain areas to be owned by groups and prevents some merge conflicts. Run the web application by using `nx serve card-component-demo`. This runs the web application on http://localhost:4200.

## Shared Components

### ProductCard
A product card component that displays the image, title, description and price of the product.

Key Decisions:
- Debated between `<article>` and `<li>` tags as the wrapper for the card. Either would work from a semantic perspective. Since this was to display a list of products, I went with `<li>` and included `<article>` inside. While that still works for individual product cards, if the ProductCard component was to be used individually, I might reconsider this approach and make the . Note that accessibility tests do complain about the `<li>` tag when there is no wrapping `<ul>`.
- Passed the entire product object via a typed prop (ProductSummary) rather than separating the properties. I feel it keeps code cleaner unless there is good reason to separate the fields into individual properties.
- From a display perspective, we want the image at the top, but for screen readers, the title is more important. In the HTML, the image is below the text to make the text more important to screen readers. I used the flexbox order property to push the display of the image above the text.
- Responsiveness - The card will be between 240px and 360px. This will handle wider screens, mobile, etc. Other approaches could include different sizes of text or the image based on the screen size (i.e. mobile could use a smaller
font size than a desktop screen).
- Vertical Responsiveness - The card is set to a fixed height of 600px (to keep consistency). The image has a height of 250px and the title and price take up the required space. If the description is too long, it will add a vertical scrollbar (other options would be a text-ellipsis or limit lines, etc.).
- onProductClicked vs Router Navigate - The cards emit an onProductClicked event when the card is clicked rather than navigating directly via the link provided with the product. This makes the shared component more reusable by letting the consuming package decide how to navigate or react to the click. The actual navigation is handled via the Products component in the products-feature package.

### ProductCardList
Very simple unordered list that maps the products to the ProductCard component

