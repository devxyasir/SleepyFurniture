import { CategoryLists } from "./categoryLists";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { setSelectedCategory, setSelectedSubCategoryForFilter } from "../../../features/filterBySlice";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

const Index = ({ setCheckedCategoryDOM }) => {
  const [isCategorySectionOpen, setIsCategorySectionOpen] = useState(true);

  const dispatch = useDispatch();

  // THE MAPPED JSON TO CREATE THE CHECKBOX AND CATEGORY UI
  const productCategories = {
    "Featured Categories": ["featured", "first order deal", "discounts"],
    location: ["kitchen", "dining", "bedroom", "living room", "office"],
    features: ["chairs", "tables", "sets", "cupboards", "lighting", "sofa"],
    others: ["kids"],
  };

  // LOOP THROUGH THE DESCENDANTS WHILE SKIPPING THE EVENT TARGET AND GET THE CHECKBOXES DOM
  const handleCheckedCategory = (e) => {
    let descendants = e.currentTarget.getElementsByTagName("*");
    for (let i = 0; i < descendants.length; i++) {
      if (descendants[i] === e.target) {
        continue;
      }
      descendants[i].checked = false;
    }

    if (e.target.checked) {
      dispatch(
        setSelectedCategory(e.target.parentElement.parentElement.previousElementSibling.firstElementChild.textContent)
      );
      dispatch(setSelectedSubCategoryForFilter(e.target.value));
      setCheckedCategoryDOM(e.target);
    } else {
      dispatch(setSelectedCategory(null));
      dispatch(setSelectedSubCategoryForFilter(null));
    }
  };

  return (
    <article className="flex flex-col gap-4 md:gap-5 tablet:gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Categories</h3>
        {isCategorySectionOpen ? (
          <RiArrowDropUpLine
            className=" w-8 h-6 cursor-pointer"
            onClick={() => setIsCategorySectionOpen(!isCategorySectionOpen)}
          />
        ) : (
          <RiArrowDropDownLine
            className="w-8 h-6 cursor-pointer"
            onClick={() => setIsCategorySectionOpen(!isCategorySectionOpen)}
          />
        )}
      </div>
      <AnimatePresence>
        {isCategorySectionOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ overflowY: "hidden", height: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            className="flex flex-col gap-4 tablet:gap-5 md:gap-5 w-[100%]"
            onChange={(e) => handleCheckedCategory(e)}
          >
            {Object.keys(productCategories).map((categoryTitle, index) => {
              return <CategoryLists key={index} {...{ categoryTitle, productCategories }} />;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

export default Index;
