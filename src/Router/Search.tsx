import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { searchTermFromPath } from "../navigation";
import SearchResults from "./SearchResults";

const FormContainer = styled.div`
  margin: 50px 0;
  display: flex;
  justify-content: center;
`;
const Form = styled(motion.form)`
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 0 20px;
`;
const Input = styled(motion.input)`
  width: 100%;
  height: 60px;
  border: none;
  outline: none;
  padding: 12px 30px;
  font-size: 22px;
  border-radius: 20px;
  font-weight: 500;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.1));
`;

interface iForm {
  search: string;
}

const ResultsContainer = styled.div``;

function Search() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<iForm>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const searchTerm = searchTermFromPath(pathname);
  const searchValid = ({ search }: iForm) => {
    navigate(`/search/${encodeURIComponent(search)}`);
    setValue("search", "");
  };
  return (
    <>
      <FormContainer>
        <Form
          onSubmit={handleSubmit(searchValid)}
          initial={{ y: -200 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Input
            {...register("search", {
              required: true,
              validate: (value) =>
                (value !== "." && value !== "..") ||
                "Enter a search term other than . or ..",
            })}
            placeholder="Search coins..."
            type="text"
            autoFocus
            autoComplete="off"
            autoSave="off"
            autoCorrect="off"
          />
        </Form>
      </FormContainer>
      {errors.search?.message && <p role="alert">{errors.search.message}</p>}
      <ResultsContainer>
        {searchTerm !== undefined && <SearchResults searchId={searchTerm} />}
      </ResultsContainer>
    </>
  );
}

export default Search;
