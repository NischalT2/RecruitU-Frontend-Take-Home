# RecruitU — Candidate Workspace

A responsive candidate browsing interface, where recruiters can search, filter, and review candidate profiles.

## Running the project

Project hosted on Vercel: [recruitu-frontend-take-home.vercel.app](recruitu-frontend-take-home.vercel.app).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What I built

The layout consists of a sticky navbar with the logo on the top left and a centered search bar, a collapsible filter sidebar on the left, a scrollable candidate card grid in the center, and a slide-in profile panel on the right that opens after clicking on a candidate card. The filter sidebar consists of 5 ways to filter the candidates that are being shown, which includes seniority, skills, degree, country, and saved. Each of these filter sections are collapsable and it contains a scrollable area if required and a search bar if it consists of more than 8 filter options. It is also programmed to be dyamic on mobile and smaller screens. On mobile, the sidebar becomes a full-screen overlay with a backdrop and scroll locking, and the profile panel takes over the full screen with a back button to return to the grid. Additionally, the number of grid that is shown on the screen is dynamic as it will decrease to 1 or 2, depending on the amount of space available for it. The candidate card displays various information about the candidate, ranging from their name, location, previous companies, and skills. It also includes a bookmark button that enables the recruiters to save certain candidates that they deem fit. Finally, clicking on a candidate card opens the profile panel on the right, which displays the user's information and contacts (email and number).

Features:

**Search** — a debounced name search in the navbar
**Sidebar filters** — collapsible sections for multi-select filters for seniority, skills, degree, country, and a "saved only" toggle. Sections with 8+ options include a search bar with debouncing. When the sidebar is collapsed, an active filter count badge appears on the toggle icon so it's clear filters are still applied
**Candidate grid** — responsive card grid that displays the candidates and their information; updates live as filters are applied, with a result count header
**Profile panel** — a slide-in candidate detail panel on the right. Supports keyboard navigation (left and right arrows ←/→ to move between candidates, Escape to close). On mobile it takes over the full screen when opened with a back button
**Save candidates** — bookmark any candidate; state is persisted to `localStorage` and survives page refresh

Data is fetched server-side from the [randomuser.me](https://randomuser.me) API, which is seeded for consistency. The data that is fetched is then transformed into a `Candidate` shape by adding randomized values for seniority, skills, previous companies, and education. The seniority level, and the number of skills and previous companies are derived from a randomly generated years-of-experience value for each candidate.

## Key decisions

**Hierarchy within the candidate card** - The candidate card is divided into four distinct sections: identity (profile photo, name, seniority, location), career and education, skills, and a footer with a "View Profile" prompt. The information is ordered by what a recruiter scans first: who the candidate is, where they have worked, their education, and what they can do. The name is the strongest visual element, followed by the seniority badge with years of experience (color-coded by level). Location is de-emphasized with a tertiary color since it is less critical at first glance. Previous companies are semi-bold, important enough to stand out, but not competing with the name. Education is de-emphasized and skills are displayed as chips at the bottom for a quick scan.

**Vertical Alignment in Candidate Card** - The elements in the candidate card are vertically aligned, which ensures that recruiters are able to scan through each candidate card as quickly as possible without needing to shift their gaze to different parts of the screen.

**Capped Skills and Companies, and Truncation** - The skills shown on the card are capped at 3, and the previous companies are capped to 2 to ensure that every card is uniform; without the cap, the cards with more skills would grow taller than others and break the grid's visual balance. Overflow is shown with a +N indicator for more information on the candidate. Additionally, text within the skill chips are truncated at 90px, which prevents a long skill name from pushing other chips off the card and prevents the break of the balance of the card's spacing and height.

**Server component for data fetching, client component for interactivity** - `app/page.tsx` is an async server component that fetches and transforms candidates at request time. It passes the data down to `PageClient`, which owns all interactive state. This keeps the data-fetching path clean and avoids client-side loading states for the initial render.

**`useMemo` for filtering instead of a separate state** - `filteredCandidates` is derived directly from `filters` and `savedIds` through `useMemo` rather than these values being stored in its own state. This is due to the fact that states need to be manually kept in sync, meaning that there is a necessity for useEffect every time a new input is added or removed, which results in instances where the UI shows stale filtered results since the useEffect only runs after the render. Unlike `useState`, `useMemo` ensures that the filtered list is always in sync with the current filter state without needing manual updates — and React only recomputes it when the inputs actually change.

**`localStorage` hydrated via `useEffect` and `startTransition`** - Saved IDs are initialized as an empty `Set` and hydrated from `localStorage` in a `useEffect` (not in the `useState` initializer) to avoid SSR mismatches. This hydration error occurs because the components on the server are rendered first; however, localStorage does not exist on the server and therefore would either crash or return an empty set, and then afterwards return the saved IDS on the client. This would result in a mismatch between the server rendered HTML and what the client hydrates with, resulting in the error. Additionally, the update is wrapped in `startTransition` so React treats it as non-urgent and doesn't block the initial paint. This is important because React treats setState calls as urgent, synchronously re-rendering the component and all of its children; however, the browser is already busy while painting the UI during the mount, so this could lead to a delay. Thus, `startTransition` tells the React to do the setState whenever it has free time, avoiding this delay.

**CSS `grid-template-rows` trick for collapse animation** - The sidebar filter sections animate open and closed by transitioning `grid-template-rows` between `0fr` and `1fr`. I use this trick instead of the `max-height` trick because that can lead to timing issues with larger values. Essentially, this is necessary because CSS can't transition `height: auto`, but it can transition grid row sizes. Thus, using this trick allows for the smooth use of the collapse animation.  

**Double `requestAnimationFrame` for the profile panel slide-in** - When the profile panel opens, `isSlidIn` is set to `true` inside two nested `requestAnimationFrame` calls rather than immediately. This ensures the element is fully in the DOM and painted before the CSS transition fires because without the delay, the browser would skip the transition and jump straight to the final position, which wouldn't be as smooth and seamless. 

**`MediaQueryList` for mobile detection** - Rather than using a CSS-only responsive approach for layout branching that requires JavaScript awareness (scroll locking, compact filter mode), the sidebar listens to a `window.matchMedia` query and stores `isMobile` in state. The initial check is deferred with `queueMicrotask` to avoid reading the query before the browser has resolved it on mount.

**Selected options float to the top of filter lists** - `orderedOptions` in `MultiSelectSection` sorts selected items before unselected ones using `Number(selected.includes(b)) - Number(selected.includes(a))`. This keeps already-applied filters visible at the top without the user having to scroll, which is especially useful where there are sections with a large amount of filter options (skills, countries).

**Skill filter uses OR logic** - A candidate matches the skills filter if they have ANY of the selected skills, not ALL of them. This keeps the result set wider and more useful. I chose it to have an OR logic instead of an AND logic because in our case, there is not enough data and candidates to use the AND logic to its benefits as it would quickly result in an empty list. Thus, to scale this app further, it may be more beneficial for recruiters to be able to see candidates with all the selected skills rather than candidates with any of the selected skills.

**Country options derived from data, not hardcoded** - Country filter options are computed from the actual fetched candidates, so the filter only shows countries that are actually present in the current dataset rather than a static list that could be stale or mismatched. 

**Collapsible and Searchable Filters** - Without the collapsible filters, all the filter options would be visible at once, and the filters would be cluttered on the left side, making it harder to focus on any one filter. Collapsing keeps the sidebar clean and lets recruiters expand only what they need. Additionally, the search bar inside each section, which shows up only when there are 8+ options, addresses the problem of needing to scroll through a large list of options to find the filter, which is slow and inefficient. 

**Profile Panel** - The profile panel opens as a slide-in panel on the right rather than a modal or a separate page, which allows recruiters to keep going through the list of candidates while also being able to switch between the candidates without navigating away. On mobile the panel takes over the full screen since there is not enough space to show both the list of candidates and the panel side by side. 

## What I'd improve with more time

**Pagination** - Currently, only 50 users are fetched from the API and all candidate cards are rendered for every one of these users at once. However, in the case that there is a large database with large number of users, it is very expensive and slow to render hundreds of these candidate card DOM nodes simultaneously. Thus, implementing a pagination where only a small number of candidates are displayed at a time would fix this by loading candidates in chunks. This would make the experience much faster. 

**Error handling and Retries for Data Fetching** - Currently, the program assumes that everything will work fine. For instance, it only calls the API once and there are no retries. This is essentially ok for now but when scaling for larger databases and with real customers and users, it is very important that everything is error proof. So, it is very important that there are various steps in place to prevent any fault from occuring. An example is to include retry logic to the API call because if an API call fails and there are no retries, then the server components throws and the user runs into a broken page. For a production app with hundreds and thousands of users at a time, this would be detrimental; therefore, it is important that such steps are take into account when scaling. 

**Fix for Prop drilling** - Currently, filters and setFilters are passed through numerous components, PageClient -> Navbar -> Searchbar, and then separately into Sidebar -> MultiSelectSelection. This is manageable in this project since the app is still small; however, if the app grew and needed more components with these props, it would be hard to maintain and possibly run into issues. Thus, to fix this, I would use a lightweight state manager such as Zustand so that these become global states, allowing any component to access them without needing to pass the props through every level. 

**Feature Implementation: Match Scores** - An additional feature I would want to add is a match score that rates each candidate against a recruiter-defined job description. Rather than manually toggling filters, the recruiter pastes a job description and the app computes a score for each candidate based on skill overlap and experience. At a basic level this could be a weighted keyword match, but at a higher level, the job description and candidate profiles could be embedded and compared using cosine similarity. Then, the score would be displayed on each card and used to rank the grid, so the cards with the highest scores rise to the top.

**Change Between *AND* or *OR* logic for the skills filter** - Currently the skills filter uses *OR* logic, meaning that a candidate matches if they have any of the selected skills. This keeps the result set wide, which works well when browsing broadly. However, a recruiter hiring for a specific role might want to filter for candidates who have all of the required skills, not just one of them. Adding a toggle to switch between OR ("any of these skills") and AND ("all of these skills") would make the filter significantly more useful without adding complexity to the UI.

**Race Conditions** - This is not an issue in our current project because filtering is done on the client-side using `useMemo` so there are no async operations that could resolve out of order. However, in the case that filtering is moved to the server side, fetch results from an API on filter changes could result in a race condition. This is because if a user types to quickly, a later request could be resolved before an earlier one, displaying stale results. Therefore, to fix this, we would want to use AbortController, which cancels the previous requests before firing the next one, preventing such issue from occuring.