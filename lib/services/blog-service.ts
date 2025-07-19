import type { BlogPost } from "../types"

// Update the mock blog data to use more reliable placeholder images
// Find the MOCK_BLOGS array and update the coverImage URLs

// For example, replace URLs like:
// coverImage: "/placeholder.svg?height=400&width=800&text=Blockchain+Technology",

// With:
// coverImage: "https://placehold.co/800x400/e2e8f0/1e293b?text=Blockchain+Technology",

// Update all three blog entries:
const MOCK_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "Introduction to Blockchain Technology",
    excerpt: "Learn the fundamentals of blockchain technology and how it's revolutionizing industries.",
    content: `
     <h2>What is Blockchain?</h2>
     <p>Blockchain is a distributed ledger technology that allows data to be stored globally on thousands of servers. This makes it very difficult for the data to be altered or hacked.</p>
     <p>At its core, blockchain is a list of transactions that anyone can view and verify. The Bitcoin blockchain, for example, contains a record of every time someone sent or received bitcoin.</p>
     <h2>Key Features of Blockchain</h2>
     <ul>
       <li><strong>Decentralization</strong>: No single entity has control over the network</li>
       <li><strong>Transparency</strong>: All transactions are visible to anyone</li>
       <li><strong>Immutability</strong>: Once data is recorded, it cannot be altered</li>
       <li><strong>Security</strong>: Cryptographic principles ensure data integrity</li>
     </ul>
     <p>Blockchain technology has applications far beyond cryptocurrencies. It's being used in supply chain management, healthcare, voting systems, and more.</p>
   `,
    coverImage: "https://placehold.co/800x400/e2e8f0/1e293b?text=Blockchain+Technology",
    category: "Blockchain",
    author: {
      id: "author1",
      name: "Alex Johnson",
      avatar: "https://placehold.co/100x100/e2e8f0/1e293b?text=AJ",
    },
    publishedAt: "2023-11-15T10:30:00Z",
  },
  {
    id: "2",
    title: "The Future of DeFi: Trends to Watch",
    excerpt: "Explore emerging trends in decentralized finance and what they mean for the future of banking.",
    content: `
     <h2>What is DeFi?</h2>
     <p>Decentralized Finance (DeFi) refers to financial services built on blockchain technology that operate without centralized intermediaries like banks or financial institutions.</p>
     <p>DeFi applications aim to recreate traditional financial systems with cryptocurrency, enabling activities like lending, borrowing, and trading without relying on centralized authorities.</p>
     <h2>Key Trends in DeFi</h2>
     <h3>1. Cross-Chain Integration</h3>
     <p>As different blockchain networks continue to evolve, cross-chain solutions are becoming increasingly important. These technologies allow assets and data to move seamlessly between different blockchains.</p>
     <h3>2. Institutional Adoption</h3>
     <p>Major financial institutions are beginning to explore DeFi opportunities, bringing increased legitimacy and capital to the space.</p>
     <h3>3. Improved User Experience</h3>
     <p>Early DeFi applications were often complex and difficult to use. Newer platforms are focusing on simplifying the user experience to attract mainstream adoption.</p>
     <p>The future of DeFi looks promising, with potential to transform how we think about and interact with financial services.</p>
   `,
    coverImage: "https://placehold.co/800x400/e2e8f0/1e293b?text=DeFi+Trends",
    category: "Finance",
    author: {
      id: "author2",
      name: "Sarah Chen",
      avatar: "https://placehold.co/100x100/e2e8f0/1e293b?text=SC",
    },
    publishedAt: "2023-12-03T14:15:00Z",
  },
  {
    id: "3",
    title: "Web3 Development: Getting Started",
    excerpt: "A beginner's guide to developing applications for the decentralized web.",
    content: `
     <h2>What is Web3?</h2>
     <p>Web3 represents the next evolution of the internet, built on decentralized technologies like blockchain. Unlike Web2 (the current internet dominated by centralized platforms), Web3 aims to give users more control over their data and digital identities.</p>
     <h2>Essential Tools for Web3 Development</h2>
     <h3>1. Ethereum and Smart Contracts</h3>
     <p>Ethereum is one of the most popular platforms for Web3 development. Learning Solidity, Ethereum's smart contract language, is often a good starting point.</p>
     <pre><code>// Simple smart contract example
contract HelloWorld {
   string public message;
   
   constructor(string memory initialMessage) {
       message = initialMessage;
   }
   
   function updateMessage(string memory newMessage) public {
       message = newMessage;
   }
}</code></pre>
     <h3>2. Web3.js and ethers.js</h3>
     <p>These JavaScript libraries allow your frontend applications to interact with blockchain networks.</p>
     <h3>3. IPFS</h3>
     <p>InterPlanetary File System (IPFS) is a protocol for storing and sharing data in a distributed system, commonly used for storing files in Web3 applications.</p>
     <h2>Building Your First dApp</h2>
     <p>A decentralized application (dApp) typically consists of smart contracts on the blockchain and a frontend interface. Frameworks like Hardhat and Truffle can help streamline the development process.</p>
     <p>Web3 development is an exciting field with enormous potential for innovation. As you build your skills, you'll be contributing to the future of the internet!</p>
   `,
    coverImage: "https://placehold.co/800x400/e2e8f0/1e293b?text=Web3+Development",
    category: "Development",
    author: {
      id: "author3",
      name: "Michael Rodriguez",
      avatar: "https://placehold.co/100x100/e2e8f0/1e293b?text=MR",
    },
    publishedAt: "2024-01-20T09:45:00Z",
  },
]

// Get all blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  // In a real application, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_BLOGS)
    }, 800) // Simulate network delay
  })
}

// Get a single blog post by ID
export async function getBlogPost(id: string): Promise<BlogPost> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const blog = MOCK_BLOGS.find((blog) => blog.id === id)
      if (blog) {
        resolve(blog)
      } else {
        reject(new Error(`Blog post with ID ${id} not found`))
      }
    }, 500)
  })
}

// Create a new blog post
export async function createBlogPost(blogData: Partial<BlogPost>): Promise<BlogPost> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBlog: BlogPost = {
        id: `${Date.now()}`, // Generate a unique ID
        title: blogData.title || "Untitled",
        excerpt: blogData.excerpt || "",
        content: blogData.content || "",
        coverImage: blogData.coverImage || "",
        category: blogData.category || "Uncategorized",
        author: blogData.author || {
          id: "default",
          name: "Anonymous",
          avatar: "/placeholder.svg?height=100&width=100",
        },
        publishedAt: blogData.publishedAt || new Date().toISOString(),
      }

      // In a real app, we would save this to a database
      // For now, we'll just return the new blog
      resolve(newBlog)
    }, 1000)
  })
}

// Update an existing blog post
export async function updateBlogPost(id: string, blogData: Partial<BlogPost>): Promise<BlogPost> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const blogIndex = MOCK_BLOGS.findIndex((blog) => blog.id === id)
      if (blogIndex !== -1) {
        // In a real app, we would update the database
        // For now, we'll just return the updated blog
        const updatedBlog: BlogPost = {
          ...MOCK_BLOGS[blogIndex],
          ...blogData,
          updatedAt: new Date().toISOString(),
        }
        resolve(updatedBlog)
      } else {
        reject(new Error(`Blog post with ID ${id} not found`))
      }
    }, 1000)
  })
}

// Delete a blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const blogIndex = MOCK_BLOGS.findIndex((blog) => blog.id === id)
      if (blogIndex !== -1) {
        // In a real app, we would delete from the database
        // For now, we'll just return success
        resolve(true)
      } else {
        reject(new Error(`Blog post with ID ${id} not found`))
      }
    }, 800)
  })
}
