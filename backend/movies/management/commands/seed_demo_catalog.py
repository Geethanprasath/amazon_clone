from django.core.management.base import BaseCommand

from movies.models import Category, Movie


CATEGORIES = {
    'Action': 'High stakes, close calls, and no time to look back.',
    'Comedy': 'Sharp wit and lighter nights, all in one place.',
    'Drama': 'Characters and choices that stay with you.',
    'Horror': 'Unsettling stories for the brave after dark.',
    'Sci-Fi': 'New worlds, strange signals, and bigger questions.',
    'Thriller': 'Tense turns and mysteries that refuse to sit still.',
    'Romance': 'Unexpected meetings and stories about finding each other.',
    'Animation': 'Inventive worlds, brought to life frame by frame.',
    'Documentary': 'Real places and ideas worth a closer look.',
}

POSTERS = {
    'stars': 'photo-1534796636912-3b95b3ab5986',
    'mountain': 'photo-1519608487953-e999c86e7455',
    'ocean': 'photo-1518837695005-2083093ee35b',
    'lake': 'photo-1470770841072-f978cf4d019e',
    'sunset': 'photo-1470252649378-9c29740c9fa8',
    'forest': 'photo-1448375240586-882707db888b',
    'trail': 'photo-1500530855697-b586d89ba3ee',
    'peaks': 'photo-1500534623283-312aade485b7',
    'snow': 'photo-1519681393784-d120267933ba',
}

MOVIES = [
    {
        'title': 'Signal at Perihelion',
        'description': 'At the edge of a dying star, a salvage pilot discovers a signal that should not exist. Answering it takes her crew farther into the dark than anyone has gone.',
        'genre': 'Science Fiction', 'release_year': 2026, 'duration': 128, 'rating': '8.4',
        'poster': 'stars', 'backdrop': 'photo-1446776811953-b23d57bd21aa',
        'cast': ['Anika Reeve', 'Tomas Vale', 'Ivo Chen'], 'director': 'Maya Sato',
        'categories': ['Sci-Fi'],
    },
    {
        'title': 'The Glass Frontier',
        'description': 'A survey crew maps the first habitable valley on a moon where every sunrise arrives days late.',
        'genre': 'Science Fiction', 'release_year': 2025, 'duration': 114, 'rating': '8.1',
        'poster': 'mountain', 'cast': ['Mira Sol', 'Evan Rook', 'Noor Kim'], 'director': 'Lian Voss',
        'categories': ['Sci-Fi'],
    },
    {
        'title': 'Blue Meridian',
        'description': 'A coastal investigator follows vanished ships to a research station hidden beneath the tide.',
        'genre': 'Thriller', 'release_year': 2025, 'duration': 108, 'rating': '7.9',
        'poster': 'ocean', 'cast': ['Rhea Calder', 'Jonas Wren', 'Milo Hart'], 'director': 'Tess Arlow',
        'categories': ['Thriller'],
    },
    {
        'title': 'A Map of Silence',
        'description': 'Returning to her lakeside hometown, a sound archivist uncovers the story her family left unspoken.',
        'genre': 'Drama', 'release_year': 2024, 'duration': 122, 'rating': '8.3',
        'poster': 'lake', 'cast': ['Nadia Vale', 'Theo Ames', 'June Park'], 'director': 'Elian Mercer',
        'categories': ['Drama'],
    },
    {
        'title': 'Copper Sky',
        'description': 'A courier and a retired pilot race a storm across a continent that has run out of clean water.',
        'genre': 'Adventure', 'release_year': 2026, 'duration': 116, 'rating': '7.8',
        'poster': 'sunset', 'cast': ['Ari Bell', 'Ronan Hale', 'Sela Quinn'], 'director': 'Dara Imani',
        'categories': ['Action'],
    },
    {
        'title': 'The Last Orchard',
        'description': 'An archivist inherits an orchard where every tree holds a clue to a decades-old disappearance.',
        'genre': 'Mystery', 'release_year': 2025, 'duration': 111, 'rating': '8.6',
        'poster': 'trail', 'cast': ['Maren Ellis', 'Cal Rivas', 'Inez Wu'], 'director': 'Suri Morrow',
        'categories': ['Thriller'],
    },
    {
        'title': 'Borrowed Time',
        'description': 'A clockmaker gets one last chance to repair the day that changed the lives of everyone on her street.',
        'genre': 'Drama', 'release_year': 2023, 'duration': 105, 'rating': '7.7',
        'poster': 'peaks', 'cast': ['Lena Frost', 'Omar Bell', 'Eli Tan'], 'director': 'Kira Solberg',
        'categories': ['Drama'],
    },
    {
        'title': 'Quiet Orbit',
        'description': 'Alone above a silent planet, a flight engineer begins receiving messages from the future crew.',
        'genre': 'Science Fiction', 'release_year': 2026, 'duration': 121, 'rating': '8.1',
        'poster': 'stars', 'cast': ['Tarin Cho', 'Mira Ellery', 'Pax Nwosu'], 'director': 'Lian Voss',
        'categories': ['Sci-Fi'],
    },
    {
        'title': 'Red City',
        'description': 'A night-shift medic crosses a city under lockdown to bring a witness safely home.',
        'genre': 'Action', 'release_year': 2026, 'duration': 102, 'rating': '8.0',
        'poster': 'mountain', 'cast': ['Dax Rowan', 'Amara Bell', 'Kit Mercer'], 'director': 'Niko Reyes',
        'categories': ['Action'],
    },
    {
        'title': 'Low Tide',
        'description': 'A marine biologist returns to a remote harbor and finds evidence that the missing crew is still nearby.',
        'genre': 'Thriller', 'release_year': 2024, 'duration': 110, 'rating': '7.8',
        'poster': 'ocean', 'cast': ['Rhea Calder', 'Sana Vale', 'Theo Marsh'], 'director': 'Tess Arlow',
        'categories': ['Thriller'],
    },
    {
        'title': 'Winter Signal',
        'description': 'A weather station operator decodes a repeating signal buried inside the longest winter on record.',
        'genre': 'Science Fiction', 'release_year': 2025, 'duration': 118, 'rating': '8.2',
        'poster': 'snow', 'cast': ['Noor Kim', 'Evan Rook', 'Luca Fen'], 'director': 'Maya Sato',
        'categories': ['Sci-Fi'],
    },
    {
        'title': 'Sunroom',
        'description': 'Three mismatched neighbors turn a greenhouse on their apartment roof into the brightest room in town.',
        'genre': 'Comedy', 'release_year': 2026, 'duration': 96, 'rating': '7.9',
        'poster': 'sunset', 'cast': ['June Park', 'Rafi Miles', 'Nell Avery'], 'director': 'Suri Morrow',
        'categories': ['Comedy'],
    },
    {
        'title': 'The Hollow Guest',
        'description': 'A caretaker accepts a winter job at an empty inn where each locked room has a different guest list.',
        'genre': 'Horror', 'release_year': 2025, 'duration': 107, 'rating': '7.6',
        'poster': 'trail', 'cast': ['Inez Wu', 'Pax Nwosu', 'Maren Ellis'], 'director': 'Dara Imani',
        'categories': ['Horror'],
    },
    {
        'title': 'Letters to June',
        'description': 'Two strangers begin exchanging letters after a small-town post office sends their parcels to the wrong doors.',
        'genre': 'Romance', 'release_year': 2024, 'duration': 101, 'rating': '7.9',
        'poster': 'sunset', 'cast': ['Nell Avery', 'Omar Bell', 'Lena Frost'], 'director': 'Kira Solberg',
        'categories': ['Romance'],
    },
    {
        'title': 'Small Worlds',
        'description': 'A curious cloud collector and a tiny lighthouse keeper set out to return the stars to the night sky.',
        'genre': 'Animation', 'release_year': 2026, 'duration': 89, 'rating': '8.2',
        'poster': 'peaks', 'cast': ['Kit Mercer', 'Sela Quinn', 'Tarin Cho'], 'director': 'Elian Mercer',
        'categories': ['Animation'],
    },
    {
        'title': 'The Quiet Canopy',
        'description': 'Field researchers and local guides document the hidden life of an old-growth forest through one changing season.',
        'genre': 'Documentary', 'release_year': 2025, 'duration': 93, 'rating': '8.5',
        'poster': 'forest', 'cast': ['Milo Hart', 'Nadia Vale', 'Ari Bell'], 'director': 'Ronan Hale',
        'categories': ['Documentary'],
    },
]


def image_url(photo_id, width):
    return f'https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w={width}&q=82'


class Command(BaseCommand):
    help = 'Create or update the fictional StreamX demo catalog.'

    def handle(self, *args, **options):
        category_objects = {
            name: Category.objects.update_or_create(name=name, defaults={'description': description})[0]
            for name, description in CATEGORIES.items()
        }
        created_count = 0

        for movie_data in MOVIES:
            movie_data = movie_data.copy()
            category_names = movie_data.pop('categories')
            poster_key = movie_data.pop('poster')
            backdrop_id = movie_data.pop('backdrop', POSTERS[poster_key])
            photo_id = POSTERS[poster_key]
            movie_data.update({
                'poster': image_url(photo_id, 720),
                'backdrop': image_url(backdrop_id, 1800),
                'video_url': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            })
            _, created = Movie.objects.update_or_create(
                title=movie_data['title'],
                defaults=movie_data,
            )
            movie = Movie.objects.get(title=movie_data['title'])
            movie.categories.set(category_objects[name] for name in category_names)
            created_count += int(created)

        self.stdout.write(self.style.SUCCESS(
            f'Demo catalog ready: {created_count} new movies, {len(CATEGORIES)} categories.'
        ))