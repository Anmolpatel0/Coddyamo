
        /**
         * Central Configuration Object
         * Provides easy updates for social handles, images, and contact links.
         */
        const CONFIG = {
            founderName: "Anmol Patel",
            founderTitle: "Founder of CODDYAMO | Aspiring Full-Stack Developer",
            githubUsername: "Anmolpatel0",
            email: "anmolpatel7803@gmail.com",
            instagramUsername: "anmol._09_",
            linkedinUrl: "https://www.linkedin.com/in/anmol-patel-7a5b78378/",
            telegramInviteUrl: "", // Invite URL placeholder
            profileImagePath: "profile.jpg",
            logoImagePath: "profile_amo.png",

            // Base64 SVGs for graceful missing-image fallbacks
            fallbackLogo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23a855f7'><circle cx='50' cy='50' r='45' fill='%2305070F' stroke='%23a855f7' stroke-width='4'/><text x='50%' y='55%' text-anchor='middle' fill='%2306b6d4' font-family='sans-serif' font-weight='bold' font-size='32'>C</text></svg>",
            fallbackFounder: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%230A0E1A' stroke='%2306b6d4' stroke-width='4'/><path d='M50 25 a15 15 0 1 0 0.1 0 M30 75 a20 20 0 0 1 40 0' fill='none' stroke='%23a855f7' stroke-width='4' stroke-linecap='round'/></svg>"
        };

        // State variables
        let rawRepositories = [];

        // Image Load Error Handler
        function handleImageError(imgElem, type) {
            imgElem.onerror = null;
            if (type === 'logo') {
                imgElem.src = CONFIG.fallbackLogo;
            } else {
                imgElem.src = CONFIG.fallbackFounder;
            }
        }

        // App Initialization
        document.addEventListener('DOMContentLoaded', () => {
            initApp();
            fetchGitHubRepositories();
        });

        function initApp() {
            // Update Date
            document.getElementById('currentYear').textContent = new Date().getFullYear();

            // Set Brand Info
            document.getElementById('founderNameHero').textContent = CONFIG.founderName;
            document.getElementById('founderFullName').textContent = CONFIG.founderName;
            document.getElementById('founderTitle').textContent = CONFIG.founderTitle;

            // Set Images
            document.getElementById('headerLogoImg').src = CONFIG.logoImagePath;
            document.getElementById('heroLogoImg').src = CONFIG.logoImagePath;
            document.getElementById('heroFounderImg').src = CONFIG.profileImagePath;
            document.getElementById('aboutFounderImg').src = CONFIG.profileImagePath;

            // Set Links
            document.getElementById('linkGithub').href = `https://github.com/${CONFIG.githubUsername}`;
            document.getElementById('linkInstagram').href = `https://www.instagram.com/${CONFIG.instagramUsername}/`;
            document.getElementById('instaHandleText').textContent = `@${CONFIG.instagramUsername}`;
            document.getElementById('linkLinkedin').href = CONFIG.linkedinUrl;
            document.getElementById('linkEmail').href = `mailto:${CONFIG.email}`;
            document.getElementById('emailAddrText').textContent = CONFIG.email;
        }

        // Theme Toggle Functionality
        function toggleTheme() {
            const html = document.documentElement;
            const icon = document.getElementById('themeIcon');
            const iconMobile = document.getElementById('themeIconMobile');
            
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                html.classList.add('light');
                icon.className = 'fa-solid fa-sun text-amber-500';
                if(iconMobile) iconMobile.className = 'fa-solid fa-sun text-amber-500';
            } else {
                html.classList.remove('light');
                html.classList.add('dark');
                icon.className = 'fa-solid fa-moon text-brand-purple';
                if(iconMobile) iconMobile.className = 'fa-solid fa-moon text-brand-purple';
            }
        }

        // Mobile Navigation Toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }

        // Telegram Link Handler
        function handleTelegramClick() {
            if (CONFIG.telegramInviteUrl && CONFIG.telegramInviteUrl.trim() !== '') {
                window.open(CONFIG.telegramInviteUrl, '_blank');
            } else {
                alert('CODDYAMO Telegram community link will be available soon! Check back shortly.');
            }
        }

        // Setup Instructions Modal Handler
        function openInstructions(title, content) {
            document.getElementById('modalTitle').textContent = title + " — Installation";
            document.getElementById('modalContent').textContent = content;
            document.getElementById('instructionModal').classList.remove('hidden');
            document.getElementById('instructionModal').classList.add('flex');
        }

        function closeInstructions() {
            document.getElementById('instructionModal').classList.add('hidden');
            document.getElementById('instructionModal').classList.remove('flex');
        }

        // GitHub REST API Fetching with Pagination
        async function fetchGitHubRepositories() {
            const repoContainer = document.getElementById('repoContainer');
            let page = 1;
            let repos = [];
            let fetchMore = true;

            try {
                while (fetchMore && page <= 5) { // Fetch up to 5 pages (max 500 repos)
                    const response = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}/repos?per_page=100&page=${page}&sort=updated`);
                    if (!response.ok) break;

                    const data = await response.json();
                    if (data.length === 0) {
                        fetchMore = false;
                    } else {
                        repos = repos.concat(data);
                        page++;
                    }
                }

                rawRepositories = repos;
                populateLanguageFilter(repos);
                renderRepositories(repos);

            } catch (error) {
                console.error("GitHub API Error:", error);
                repoContainer.innerHTML = `
                    <div class="col-span-full p-8 text-center glass-panel rounded-2xl border border-red-500/20 text-slate-300">
                        <i class="fa-solid fa-triangle-exclamation text-3xl text-amber-400 mb-3"></i>
                        <p class="font-semibold">Unable to load live GitHub repositories right now.</p>
                        <p class="text-xs text-slate-400 mt-1">Please visit directly on GitHub.</p>
                        <a href="https://github.com/${CONFIG.githubUsername}" target="_blank" class="inline-block mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-purple text-white">
                            View @${CONFIG.githubUsername} on GitHub
                        </a>
                    </div>
                `;
            }
        }

        // Populate Language Selector
        function populateLanguageFilter(repos) {
            const langFilter = document.getElementById('repoLangFilter');
            const languages = new Set();

            repos.forEach(repo => {
                if (repo.language) languages.add(repo.language);
            });

            languages.forEach(lang => {
                const opt = document.createElement('option');
                opt.value = lang;
                opt.textContent = lang;
                langFilter.appendChild(opt);
            });
        }

        // Filter and Sort Handler
        function filterRepositories() {
            const query = document.getElementById('repoSearch').value.toLowerCase();
            const lang = document.getElementById('repoLangFilter').value;
            const sort = document.getElementById('repoSort').value;

            let filtered = rawRepositories.filter(repo => {
                const matchesSearch = repo.name.toLowerCase().includes(query) || (repo.description && repo.description.toLowerCase().includes(query));
                const matchesLang = lang === 'ALL' || repo.language === lang;
                return matchesSearch && matchesLang;
            });

            // Sorting logic
            if (sort === 'stars') {
                filtered.sort((a, b) => b.stargazers_count - a.stargazers_count);
            } else if (sort === 'name') {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
            } else { // updated
                filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            }

            renderRepositories(filtered);
        }

        // Render Repository Cards
        function renderRepositories(repos) {
            const container = document.getElementById('repoContainer');
            
            if (repos.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full py-12 text-center text-slate-400 font-mono text-xs">
                        No repositories matching your criteria were found.
                    </div>
                `;
                return;
            }

            container.innerHTML = repos.map(repo => `
                <div class="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-brand-purple/40 transition-all duration-300">
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-heading font-bold text-base text-white truncate max-w-[200px]" title="${repo.name}">
                                ${repo.name}
                            </h4>
                            ${repo.fork ? '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">Fork</span>' : ''}
                        </div>

                        <p class="text-slate-300 text-xs leading-relaxed line-clamp-2 mb-4 h-8">
                            ${repo.description || 'No description provided for this public repository.'}
                        </p>
                    </div>

                    <div class="space-y-4 pt-3 border-t border-white/5">
                        <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span class="flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-brand-cyan"></span>
                                ${repo.language || 'Plain'}
                            </span>
                            <div class="flex items-center gap-3">
                                <span><i class="fa-regular fa-star text-amber-400 mr-1"></i>${repo.stargazers_count}</span>
                                <span><i class="fa-solid fa-code-fork text-slate-400 mr-1"></i>${repo.forks_count}</span>
                            </div>
                        </div>

                        <a href="${repo.html_url}" target="_blank" rel="noopener" class="w-full py-2 rounded-xl text-center text-xs font-semibold bg-white/5 border border-white/10 hover:bg-brand-purple hover:text-white hover:border-brand-purple transition-all block">
                            View Source Code <i class="fa-solid fa-code ml-1"></i>
                        </a>
                    </div>
                </div>
            `).join('');
        }