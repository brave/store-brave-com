<script lang="ts">
  import { page } from "$app/stores";
  
  export let itemCount: number;
  export let perPageLimit: number;
  export let currentPage: number;

  $: canGoBackward = currentPage > 1;
  $: canGoForward = currentPage < pages.length;
  
  // First normalize URL to ensure trailing slash, and then create base path
  $: basePagePath = $page.url.pathname
    .replace(/([^\/])$/, "$1/")
    .replace(/\/(page\/\d*?\/)?$/, "/page");

  $: pages = Array.from({ length: Math.ceil(itemCount / perPageLimit) }, (_, i) => i + 1);
</script>

<div class="pagination">
  <span class="page-item page-first">
    <svelte:element this={canGoBackward ? 'a' : 'span'} class="page-link" class:disabled={!canGoBackward} href={canGoBackward ? `${basePagePath}/1/`: undefined}>
      <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.432 8.576a.6.6 0 0 0 0 .848l4.125 4.125a.6.6 0 0 0 .848-.848L5.705 9l3.7-3.7a.6.6 0 0 0-.848-.85L4.432 8.577ZM12.72 4.45 8.595 8.576a.6.6 0 0 0 0 .848l4.125 4.125a.6.6 0 1 0 .848-.848L9.868 9l3.7-3.7a.6.6 0 0 0-.848-.85Z" fill="currentColor"/></svg>
    </svelte:element>
  </span>
  <span class="page-item">
    <svelte:element this={canGoBackward ? 'a' : 'span'} class="page-link" class:disabled={!canGoBackward} href={canGoBackward ? `${basePagePath}/${currentPage - 1}/`: undefined}>
      <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.513 9.424a.6.6 0 0 1 0-.848l4.125-4.125a.6.6 0 1 1 .849.848L7.786 9l3.7 3.702a.6.6 0 1 1-.848.848L6.513 9.424Z" fill="currentColor"/></svg>
    </svelte:element>
  </span>
  <ol class="pagination-pages">
    {#each pages as page (page)}
      <li class="page-item" class:active={page == currentPage}>
        <a class="page-link" href={`${basePagePath}/${page}/`}>{page}</a>
      </li>
    {/each}
  </ol>
  <span class="page-item">
    <svelte:element this={canGoForward ? 'a' : 'span'} class="page-link" class:disabled={!canGoForward} href={canGoForward ? `${basePagePath}/${currentPage + 1}/`: undefined}>
      <svg class="rotate-180" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.513 9.424a.6.6 0 0 1 0-.848l4.125-4.125a.6.6 0 1 1 .849.848L7.786 9l3.7 3.702a.6.6 0 1 1-.848.848L6.513 9.424Z" fill="currentColor"/></svg>
    </svelte:element>
  </span>
  <span class="page-item page-last">
    <svelte:element this={canGoForward ? 'a' : 'span'} class="page-link" class:disabled={!canGoForward} href={canGoForward ? `${basePagePath}/${pages.length}/`: undefined}>
      <svg class="rotate-180" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.432 8.576a.6.6 0 0 0 0 .848l4.125 4.125a.6.6 0 0 0 .848-.848L5.705 9l3.7-3.7a.6.6 0 0 0-.848-.85L4.432 8.577ZM12.72 4.45 8.595 8.576a.6.6 0 0 0 0 .848l4.125 4.125a.6.6 0 1 0 .848-.848L9.868 9l3.7-3.7a.6.6 0 0 0-.848-.85Z" fill="currentColor"/></svg>
    </svelte:element>
  </span>
</div>

<style lang="scss">
  .pagination {
    padding-top: 3rem;
  }

  .pagination,
  .pagination-pages {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 4px;
  }

  .page-item {
    color: theme('colors.text.secondary');

    &.active .page-link {
      color: theme('textColor.text.interactive');
      border-color: theme('colors.primary.20');
    }

    .page-link {
      --size: 40px;

      display: flex;
      justify-content: center;
      align-items: center;

      width: var(--size);
      height: var(--size);
      border: 1px solid transparent;
      border-radius: theme('borderRadius.full');

      @apply text-default-semibold;
      color: currentColor;

      &:not(.disabled):hover {
        border-color: theme('colors.primary.60');
        color: theme('colors.primary.60');
      }

      &:not(.disabled):focus-visible {
        outline: none;
        box-shadow: theme('boxShadow.focus-state');
      }

      &.disabled {
        pointer-events: none;
        cursor: none;
        color: theme('colors.text.secondary/0.50')
      }
    }
  }

  /**
   * Auto-truncate styles modified from https://codepen.io/allicarn/pen/jPowab
   * by Allison (@allicarn)
   * License: MIT (https://opensource.org/licenses/MIT)
   */
  @mixin ellipsis($before:true) {
    content: "\2026";
    font-size: 24px;
    display: flex;
    color: currentColor;
    @if($before) {
      margin-right: 2.5px;
    } @else {
      margin-left: 2.5px;
    }
  }

  // Too much to override, just do the difference
  @media(max-width: 767px) {
    .page-item {

      &:first-child,
      &.active,
      &.active-sibling:nth-last-child(2), // Show second to last child if the last one is active
      &:last-child {
        display: flex !important;
      }

      $how-many-on-ends: 3; // 1,2,3,...,10 || 1,...,8,9,10
      // There are >= 5 pages
      &:first-child:nth-last-child(n+6) {

        &~.page-item {
          // Start out with all siblings hidden
          display: none;

          // Show the last children in the list by default
          &:nth-last-child(-n+#{$how-many-on-ends}) {
            display: flex;
          }

          // The child at the beginning of the last group shows ellipsis for the group
          &:nth-last-child(#{$how-many-on-ends}) {
            &:before {
              @include ellipsis(true);
            }
          }

          // The very beginning elements do not need to show ellipsis
          // The very end elements do not need to show ellipsis
        }

        &.active,
        &~.page-item.active {

          // Show ellipsis before and after the active element
          &:before {
            @include ellipsis(true);
          }
          &:after {
            @include ellipsis(false);
          }

          // If the active element is in the first or last group, don't show ellipsis (siblings will take care of it)
          &:nth-child(-n+#{$how-many-on-ends - 1}),
          &:nth-last-child(-n+#{$how-many-on-ends - 1}) {
            &:before, &:after {
              display: none;
            }
          }

          // Hide the last group if "active" comes before them
          &~.page-item:nth-last-child(-n+#{$how-many-on-ends}) {
            display: none;
          }

          // Show the first group together if "active" comes before them
          &~.page-item:nth-child(-n+#{$how-many-on-ends}) {
            display: flex;
          }

          // If "active" is before the last member in the group, don't show ellipsis
          &~.page-item:nth-child(-n+#{$how-many-on-ends - 1}) {
              &:after {
                display: none;
              }
          }


          // The child at the end of the first group shows ellipsis for the group
          &~.page-item:nth-child(#{$how-many-on-ends}) {
            &:after {
              @include ellipsis(false);
            }
          }
        }
      }
    }

    .page-item.page-first,
    .page-item.page-last {
      display: none !important;
    }
  }
  @media (min-width: 768px) {
    .page-item {
      &:first-child,
      &.active-sibling,
      &.active,
      &.active + .page-item,
      &:last-child {
        display: flex !important;
      }

      // There are >= 7 pages
      &:first-child:nth-last-child(n+8) {
        $how-many-on-ends: 5; // 1,2,3,4,5,...,10 || 1,...6,7,8,9,10

        &~.page-item {
          // Start out with all siblings hidden
          display: none;

          // Show ellipsis before the previous one
          &.active-sibling:before {
              @include ellipsis(true);
          }
          // Show ellipsis after the next one
          &.active + li:after {
              @include ellipsis(false);
          }

          // Show the last children in the list by default
          &:nth-last-child(-n+#{$how-many-on-ends}) {
            display: flex;
          }

          // The child at the beginning of the last group shows ellipsis for the group
          &:nth-last-child(#{$how-many-on-ends}) {
            &:before {
              @include ellipsis(true);
            }
          }

          // The very beginning elements do not need to show ellipsis
          &:nth-child(-n+#{$how-many-on-ends - 3}),
          // The very end elements do not need to show ellipsis
          &:nth-last-child(-n+#{$how-many-on-ends - 3}),
          // Even if it's a sibling to "active"
          &.active-sibling:nth-last-child(-n+#{$how-many-on-ends - 1}) {
            &:before, &:after {
              display: none !important;
            }
          }
        }

        &.active,
        &~.page-item.active {

          // Hide the last group if "active" comes before them
          &~.page-item:nth-last-child(-n+#{$how-many-on-ends}) {
            display: none;

            // If there is overlap, the element will show, but hide it's ellipsis
            &:before {
              display: none;
            }
          }

          // Show the first group together if "active" comes before them
          &~.page-item:nth-child(-n+#{$how-many-on-ends}) {
            display: flex;
          }

          // If "active" is before the last member in the group, don't show ellipsis
          &~.page-item:nth-child(-n+#{$how-many-on-ends - 1}) {
              &:after {
                display: none;
              }
          }


          // The child at the end of the first group shows ellipsis for the group
          &~.page-item:nth-child(#{$how-many-on-ends}) {
            &:after {
              @include ellipsis(false);
            }
          }

          // "active" should never show ellipsis
          &:before, &:after {
            display: none;
          }
        }
      }
    }
  }
</style>