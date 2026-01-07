document.addEventListener('DOMContentLoaded', function() {
    // 核心元素
    const heroSection = document.getElementById('hero');
    const heroTrigger = document.getElementById('heroTrigger');
    const mainContent = document.getElementById('mainContent');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBarInner = document.getElementById('progressBarInner');
    const progressText = document.getElementById('progressText');
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const chapters = document.querySelectorAll('.chapter');
    const imageModal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');
    const chapterImages = document.querySelectorAll('.chapter-img, .intro-img, .conclusion-img');

    // 解锁状态管理
    let unlockedLevels = 0;

    // 1. 首页点击：进入引言（第一关）
    heroTrigger.addEventListener('click', function() {
        // 隐藏首页
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(-100vh)';
        
        // 显示主内容+进度条+导航
        setTimeout(() => {
            heroSection.style.display = 'none';
            mainContent.classList.add('show');
            progressBarContainer.style.display = 'block';
            sidebar.style.display = 'block';
            
            // 初始化进度（0/6）
            updateProgress(0);
        }, 1000);
    });

    // 2. 解锁按钮绑定（闯关核心逻辑）
    document.getElementById('unlockChapter1').addEventListener('click', () => unlockLevel(1));
    document.getElementById('unlockChapter2').addEventListener('click', () => unlockLevel(2));
    document.getElementById('unlockChapter3').addEventListener('click', () => unlockLevel(3));
    document.getElementById('unlockChapter4').addEventListener('click', () => unlockLevel(4));
    document.getElementById('unlockChapter5').addEventListener('click', () => unlockLevel(5));
    document.getElementById('unlockConclusion').addEventListener('click', () => unlockLevel(6));

    // 3. 解锁关卡核心函数
    function unlockLevel(level) {
        // 仅解锁当前关卡（按顺序）
        if (level === unlockedLevels + 1) {
            unlockedLevels = level;
            
            // 更新进度条
            updateProgress(level);
            
            // 解锁对应章节
            const targetChapter = document.getElementById(level === 6 ? 'conclusion' : `chapter${level}`);
            if (targetChapter) {
                targetChapter.classList.add('unlocked');
                
                // 滚动到解锁的章节
                setTimeout(() => {
                    window.scrollTo({
                        top: targetChapter.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }, 300);
            }
            
            // 解锁导航项
            navItems.forEach(item => {
                const itemLevel = parseInt(item.getAttribute('data-level'));
                if (itemLevel === level) {
                    item.classList.add('unlocked');
                    item.querySelector('.lock-icon').style.display = 'none';
                }
            });

            // 播放解锁动画（可选，增强游戏感）
            const unlockAnimation = document.createElement('div');
            unlockAnimation.className = 'unlock-animation';
            unlockAnimation.innerHTML = `<i class="fas fa-star"></i> 解锁第${level}章`;
            document.body.appendChild(unlockAnimation);
            
            setTimeout(() => {
                unlockAnimation.style.opacity = '1';
                unlockAnimation.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 100);
            
            setTimeout(() => {
                unlockAnimation.style.opacity = '0';
                unlockAnimation.style.transform = 'translate(-50%, -50%) scale(0.8)';
                setTimeout(() => {
                    document.body.removeChild(unlockAnimation);
                }, 500);
            }, 1500);
        }
    }

    // 4. 更新进度条
    function updateProgress(level) {
        const progress = (level / 6) * 100;
        progressBarInner.style.width = `${progress}%`;
        progressText.textContent = `${level}/6 章节已解锁`;
    }

    // 5. 导航点击：跳转到已解锁的章节
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const level = parseInt(item.getAttribute('data-level'));
            
            // 仅允许跳转已解锁的章节
            if (item.classList.contains('unlocked')) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 6. 图片放大交互
    chapterImages.forEach(img => {
        img.addEventListener('click', function() {
            imageModal.style.display = 'block';
            modalImg.src = this.src;
            modalCaption.textContent = this.nextElementSibling?.textContent || '';
            document.body.style.overflow = 'hidden';
        });
    });

    // 关闭图片模态框
    closeModal.addEventListener('click', function() {
        imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 新增解锁动画样式（动态创建）
    const style = document.createElement('style');
    style.textContent = `
        .unlock-animation {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: rgba(77, 121, 255, 0.9);
            color: #ffffff;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 1.2rem;
            z-index: 1000;
            opacity: 0;
            transition: all 0.5s ease;
            box-shadow: 0 0 20px rgba(77, 121, 255, 0.6);
        }
        .unlock-animation i {
            margin-right: 10px;
            color: #ffffff;
        }
    `;
    document.head.appendChild(style);
});
