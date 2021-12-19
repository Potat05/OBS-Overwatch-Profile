
// let profile = {};

let games = null;

// Testing profile so we dont spam the api when changing stuff

let profile = {
    "competitiveStats": {
        "awards": {
            "cards": 36,
            "medals": 386,
            "medalsBronze": 146,
            "medalsSilver": 130,
            "medalsGold": 110
        },
        "games": {
            "played": 162,
            "won": 83
        }
    },
    "endorsement": 2,
    "endorsementIcon": "https://static.playoverwatch.com/svg/icons/endorsement-frames-3c9292c49d.svg#_2",
    "gamesWon": 4579,
    "icon": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/daeddd96e58a2150afa6ffc3c5503ae7f96afc2e22899210d444f45dee508c6c.png",
    "level": 41,
    "levelIcon": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/fa410247dd3f5b7bf2eb1a65583f3b0a3c8800bcd6b512ab1c1c4d9dd81675ae.png",
    "name": "kerbybit#1483",
    "prestige": 13,
    "prestigeIcon": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/1858704e180db3578839aefdb83b89054f380fbb3d4c46b3ee12d34ed8af8712.png",
    "private": false,
    "quickPlayStats": {
        "awards": {
            "cards": 1656,
            "medals": 14082,
            "medalsBronze": 4423,
            "medalsSilver": 4916,
            "medalsGold": 4743
        },
        "games": {
            "played": 5309,
            "won": 2706
        }
    },
    "rating": 3042,
    "ratingIcon": "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-DiamondTier.png",
    "ratings": [
        {
            "level": 3136,
            "role": "tank",
            "roleIcon": "https://static.playoverwatch.com/img/pages/career/icon-tank-8a52daaf01.png",
            "rankIcon": "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-DiamondTier.png"
        },
        {
            "level": 2948,
            "role": "damage",
            "roleIcon": "https://static.playoverwatch.com/img/pages/career/icon-offense-6267addd52.png",
            "rankIcon": "https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/rank-PlatinumTier.png"
        }
    ]
}



async function getNewProfile() {
    return new Promise((resolve, reject) => {
        const Http = new XMLHttpRequest();
        const url = `https://ow-api.com/v1/stats/${settings.platform}/${settings.region}/${settings.profile_name}-${settings.profile_id}/profile`;
        Http.open('GET', url);
        Http.send();
        
        Http.onreadystatechange = (e) => {
            if(Http.status == 400) reject('Profile not found');
            if(Http.status == 403) reject('Access denied');
            if (Http.readyState == 4 && Http.status == 200) {
                resolve(JSON.parse(Http.responseText));
            }
        }
    });
}

function setDOMProfile() {
    // Update SR elements in the DOM
    const tank = profile.ratings.find(r => r.role == 'tank');
    if(tank) document.getElementById('sr-tank').textContent = tank.level;
    const damage = profile.ratings.find(r => r.role == 'damage');
    if(damage) document.getElementById('sr-damage').textContent = damage.level;
    const support = profile.ratings.find(r => r.role == 'support');
    if(support) document.getElementById('sr-support').textContent = support.level;
    const flex = profile.ratings.find(r => r.role == 'flex');
    if(flex) document.getElementById('sr-flex').textContent = flex.level;

    // Update W-L-D elements in the DOM
    const win = profile.competitiveStats.games.won - games.won;
    const loss = profile.competitiveStats.games.played - win - games.played;
    const draw = profile.competitiveStats.games.played - win - loss - games.played;
    document.getElementById('ratio-W').textContent = win;
    document.getElementById('ratio-L').textContent = loss;
    document.getElementById('ratio-D').textContent = draw;

    document.getElementById('ratio-winPercentage').textContent = `${(win / profile.competitiveStats.games.played * 100).toFixed(2)}%`;
}

function updateProfile() {
    // if(games == null) {
    //     games = profile.competitiveStats.games;
    // }
    // setDOMProfile();
    
    getNewProfile().then(newProfile => {
        profile = newProfile;
        if(games == null) {
            games = profile.competitiveStats.games;
        }
        setDOMProfile();
    }).catch(err => {
        console.error(err);
    });

}


setInterval(updateProfile, settings.profile_update_interval_ms);
updateProfile();




let page = 0;
function nextPage() {
    page++;
    if(page > 1) page = 0;
    
    document.querySelectorAll('.page').forEach(elem => elem.classList.remove('active'));
    document.querySelector(`.page:nth-child(${page+1})`).classList.add('active');
}

setInterval(nextPage, settings.display_next_page_interval_ms);
nextPage();