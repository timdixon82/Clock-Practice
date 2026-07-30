# Log: 008-clock-container-centering

- 2026-07-30: Sonja opened work folder. Tim reported the clock isn't centered, right after 007's fix (PR #50) merged. Diagnosed as a side effect of that fix: `.clock-container` got `width: fit-content` to stop it stretching into an oval, but as a plain block element it now hugs the left edge of `<main>` instead of centering, since `body`'s `align-items: center` only centers its direct flex children, not further-nested descendants. Dispatching Sean to add horizontal centering without reintroducing the oval.
