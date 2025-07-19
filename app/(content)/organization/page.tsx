import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Building, Users, Settings, Edit, Plus, Mail, Phone, Globe, MapPin, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function OrganizationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization</h1>
        <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
          <Edit className="h-4 w-4 mr-2" />
          Edit Organization
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600 relative">
          <div className="absolute bottom-0 left-0 w-full p-6 flex items-end">
            <div className="relative">
              <div className="h-24 w-24 bg-white dark:bg-[#1F1F23] rounded-xl border-4 border-white dark:border-[#1F1F23] overflow-hidden">
                <Image
                  src="https://staging.ihaven.vip/_next/static/media/purpleLogo_whiteText.15530d30.svg"
                  alt="Organization Logo"
                  width={96}
                  height={96}
                  className="object-contain p-2"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-white dark:border-[#1F1F23]">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-white">I-HAVEN Technologies</h2>
              <p className="text-purple-100">Blockchain Solutions & Services</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="p-6">
          <TabsList className="grid grid-cols-3 gap-4 mb-6">
            <TabsTrigger value="overview">
              <Building className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Details</h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">I-HAVEN Technologies</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Established 2023</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">contact@ihaven.com</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Primary Contact Email</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Business Hours: 9AM-5PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">www.ihaven.com</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Official Website</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">123 Blockchain Avenue</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">San Francisco, CA 94103, USA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  I-HAVEN Technologies is a leading blockchain solutions provider specializing in decentralized
                  applications, smart contracts, and cryptocurrency infrastructure. Our mission is to bridge the gap
                  between traditional systems and blockchain technology, creating innovative solutions that drive the
                  future of digital transactions and asset management.
                </p>

                <h4 className="font-medium text-gray-900 dark:text-white mt-4">Industry</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full text-xs">
                    Blockchain
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs">
                    Cryptocurrency
                  </span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs">
                    Fintech
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-xs">
                    Web3
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-[#2B2B30] pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organization Structure</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-[#2B2B30]/50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Executive Team</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Leadership and strategic direction</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">5 members</span>
                    <Button variant="outline" size="sm" className="h-8">
                      View
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#2B2B30]/50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Development</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Engineering and product development</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">12 members</span>
                    <Button variant="outline" size="sm" className="h-8">
                      View
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#2B2B30]/50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Operations</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Day-to-day business operations</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">8 members</span>
                    <Button variant="outline" size="sm" className="h-8">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Members</h3>
              <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-[#2B2B30]">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-[#2B2B30]">
                    <tr className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <Image
                              src="/placeholder.svg?height=40&width=40"
                              alt="User avatar"
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Sarah Johnson</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">sarah@ihaven.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">CEO</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Executive
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Jan 15, 2023
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <Image
                              src="/placeholder.svg?height=40&width=40"
                              alt="User avatar"
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Michael Chen</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">michael@ihaven.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">CTO</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Executive
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Jan 15, 2023
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <Image
                              src="/placeholder.svg?height=40&width=40"
                              alt="User avatar"
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Rodriguez</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">alex@ihaven.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Lead Developer
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Development
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Feb 3, 2023
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <Image
                              src="/placeholder.svg?height=40&width=40"
                              alt="User avatar"
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Emily Wilson</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">emily@ihaven.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Operations Manager
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Operations
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          On Leave
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Mar 12, 2023
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <Image
                              src="/placeholder.svg?height=40&width=40"
                              alt="User avatar"
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">David Kim</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">david@ihaven.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Security Specialist
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Development
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Inactive
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Apr 5, 2023
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="orgName" className="block text-sm font-medium">
                      Organization Name
                    </label>
                    <Input id="orgName" defaultValue="I-HAVEN Technologies" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="industry" className="block text-sm font-medium">
                      Industry
                    </label>
                    <Input id="industry" defaultValue="Blockchain, Cryptocurrency, Fintech" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" defaultValue="contact@ihaven.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Phone
                    </label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="website" className="block text-sm font-medium">
                      Website
                    </label>
                    <Input id="website" type="url" defaultValue="https://www.ihaven.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="founded" className="block text-sm font-medium">
                      Founded
                    </label>
                    <Input id="founded" type="date" defaultValue="2023-01-15" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-[#2B2B30] pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="street" className="block text-sm font-medium">
                      Street Address
                    </label>
                    <Input id="street" defaultValue="123 Blockchain Avenue" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium">
                      City
                    </label>
                    <Input id="city" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="block text-sm font-medium">
                      State/Province
                    </label>
                    <Input id="state" defaultValue="CA" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="zip" className="block text-sm font-medium">
                      Zip/Postal Code
                    </label>
                    <Input id="zip" defaultValue="94103" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="block text-sm font-medium">
                      Country
                    </label>
                    <Input id="country" defaultValue="USA" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
