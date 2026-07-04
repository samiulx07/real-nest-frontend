import HomeBanner from '@/components/homeBanner/HomeBanner';
import FeaturedProjects from '@/components/featuredProjects/FeaturedProjects';
import { HOME_SEED_OBJ } from '@/shared/seeds/homeSeeds';

const HomeMainView = () => {
    return (
        <div>
            <HomeBanner slides={HOME_SEED_OBJ.bannerSlides} />
            <FeaturedProjects projects={HOME_SEED_OBJ.featuredProjects} />
        </div>
    )
};

export default HomeMainView;
