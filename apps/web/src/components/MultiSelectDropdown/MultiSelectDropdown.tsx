import {Fragment, useState} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import {CheckIcon} from '@heroicons/react/20/solid'
import {multiSelectProps} from "./types";
import {toast} from "react-toastify";


const MultiSelectDropdown = (props: multiSelectProps) => {
  const {dataArray, selectedData, setData, NoDataComponent, maxLimit, attribute } = props;
  const [query, setQuery] = useState('')

  const filteredPeople =
      query === ''
          ? null
          : dataArray.filter((dataValue) =>
              dataValue[attribute]
                  .toLowerCase()
                  .replace(/\s+/g, '')
                  .includes(query.toLowerCase().replace(/\s+/g, ''))
          )
  const handleChange = (value) =>{
    if(selectedData.length === maxLimit){
      toast.error(`maximum of ${maxLimit} tags can be used`);
      return;
    }
    setData(value);
  }
  return (
      <div >
        <Combobox value={selectedData} onChange={handleChange as any} multiple>
          <div className="relative mt-1">
            <div
                className="relative w-full cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                  className="w-full py-2 pl-3 pr-10 text-sm font-normal text-gray-900 rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white focus:ring-0 focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-0"
                  displayValue={() => ""}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Tag"
              />
            </div>
            {(filteredPeople !== null) && (<Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery('')}
            >
              <Combobox.Options
                  as={"div"}
                  className="absolute mt-1 max-h-[140px] w-full overflow-auto rounded-md border-2 border-solid border-gray-200 bg-white shadow-lg text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm scrollbar-hide">
                {filteredPeople.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      {NoDataComponent(query)}
                    </div>
                ) : (
                    filteredPeople.map((dataValue, index) => (
                        <Combobox.Option
                            key={index}
                            className={({active}) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 border-b hover:bg-slate-200 text-gray-900`
                            }
                            as={"div"}
                            value={dataValue}
                        >
                          {({selected, active}) => (
                              <>
                        <span
                            className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                            }`}
                        >

                          {dataValue[attribute]}
                        </span>
                                {selected ? (
                                    <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900 `}
                                    >
                            <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                          </span>
                                ) : null}
                              </>
                          )}
                        </Combobox.Option>
                    ))
                )}
              </Combobox.Options>
            </Transition>)}
          </div>
        </Combobox>
      </div>
  )
}
export default MultiSelectDropdown;