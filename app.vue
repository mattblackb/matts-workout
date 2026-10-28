<template>
  <div>
    <a class="skip" href="#main">Skip to content</a>
    <header class="top">
      <h1>Workout Tracker</h1>
      <nav aria-label="Main">
        <NuxtLink to="/">Today</NuxtLink>
        <NuxtLink to="/routine">Routine</NuxtLink>
        
        <NuxtLink to="/history">History</NuxtLink>
        <NuxtLink to="/settings">Settings</NuxtLink>
      </nav>
    </header>
    <main id="main" tabindex="-1">
      <NuxtPage />
    </main>
  </div>
</template>
