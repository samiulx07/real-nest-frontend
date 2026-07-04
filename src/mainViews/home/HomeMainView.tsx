import HomeBanner from '@/components/homeBanner/HomeBanner';
import FeaturedProjects from '@/components/featuredProjects/FeaturedProjects';
import FeaturedFlats from '@/components/featuredFlats/FeaturedFlats';
import WhyChooseUs from '@/components/whyChooseUs/WhyChooseUs';
import ProjectLocations from '@/components/projectLocations/ProjectLocations';
import Faq from '@/components/faq/Faq';
import { HOME_SEED_OBJ } from '@/shared/seeds/homeSeeds';

const HomeMainView = () => {
    return (
        <div>
            <HomeBanner slides={HOME_SEED_OBJ.bannerSlides} />
            <FeaturedProjects projects={HOME_SEED_OBJ.featuredProjects} />
            <FeaturedFlats flats={HOME_SEED_OBJ.featuredFlats} />
            <WhyChooseUs items={HOME_SEED_OBJ.differentiators} />
            <ProjectLocations projects={HOME_SEED_OBJ.mapProjects} />
            <Faq items={HOME_SEED_OBJ.faqs} />
        </div>
    )
};

export default HomeMainView;
