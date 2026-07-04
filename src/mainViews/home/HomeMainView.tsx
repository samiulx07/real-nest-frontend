import HomeBanner from '@/components/homeBanner/HomeBanner';
import FeaturedProjects from '@/components/featuredProjects/FeaturedProjects';
import WhyChooseUs from '@/components/whyChooseUs/WhyChooseUs';
import ProjectLocations from '@/components/projectLocations/ProjectLocations';
import { HOME_SEED_OBJ } from '@/shared/seeds/homeSeeds';

const HomeMainView = () => {
    return (
        <div>
            <HomeBanner slides={HOME_SEED_OBJ.bannerSlides} />
            <FeaturedProjects projects={HOME_SEED_OBJ.featuredProjects} />
            <WhyChooseUs items={HOME_SEED_OBJ.differentiators} />
            <ProjectLocations projects={HOME_SEED_OBJ.mapProjects} />
        </div>
    )
};

export default HomeMainView;
